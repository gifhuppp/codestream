package com.codestream.clm

import com.codestream.agentService
import com.codestream.clmService
import com.codestream.extensions.file
import com.codestream.extensions.lspPosition
import com.codestream.extensions.uri
import com.codestream.git.getCSGitFile
import com.codestream.protocols.agent.GetCommitParams
import com.codestream.review.ReviewDiffVirtualFile
import com.codestream.sessionService
import com.intellij.openapi.Disposable
import com.intellij.openapi.application.EDT
import com.intellij.openapi.application.ModalityState
import com.intellij.openapi.application.asContextElement
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.editor.Editor
import com.intellij.openapi.editor.EditorFactory
import com.intellij.openapi.editor.event.EditorFactoryEvent
import com.intellij.openapi.editor.event.EditorFactoryListener
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.fileEditor.OpenFileDescriptor
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VfsUtil
import com.intellij.psi.NavigatablePsiElement
import com.intellij.psi.PsiDocumentManager
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.eclipse.lsp4j.Range
import org.jetbrains.kotlin.idea.core.util.toPsiFile
import java.net.URI
import java.net.URL

val testMode: Boolean = System.getProperty("idea.system.path")?.endsWith("system-test") ?: false

class FindSymbolInFileResponse(
    val functionText: String,
    val range: Range
)

interface SymbolResolver {
    fun getLookupClassNames(psiFile: PsiFile): List<String>?
    fun getLookupSpanSuffixes(psiFile: PsiFile): List<String>?
    fun findClassFunctionFromFile(
        psiFile: PsiFile,
        namespace: String?,
        className: String,
        functionName: String
    ): PsiElement?

    fun findTopLevelFunction(psiFile: PsiFile, functionName: String): PsiElement?
}

abstract class CLMLanguageComponent<T : CLMEditorManager>(
    val project: Project,
    private val fileType: Class<out PsiFile>,
    val editorFactory: (editor: Editor) -> T,
    private val symbolResolver: SymbolResolver
) : EditorFactoryListener, Disposable {
    private val logger = Logger.getInstance(CLMLanguageComponent::class.java)
    private val managersByEditor = mutableMapOf<Editor, CLMEditorManager>()

    @Suppress("UNCHECKED_CAST")
    constructor(project: Project, fileType: String, editorFactory: (editor: Editor) -> T, symbolResolver: SymbolResolver) : this(
        project,
        CLMLanguageComponent::class.java.classLoader.loadClass(fileType) as Class<PsiFile>,
        editorFactory,
        symbolResolver
    )

    init {
        if (!project.isDisposed) {
            EditorFactory.getInstance().addEditorFactoryListener(
                this, this
            )
            project.sessionService?.onCodelensChanged {
                managersByEditor.values.forEach { it.loadInlays(true, true) }
            }
            project.clmService?.registerLanguageComponent(this)
        }
    }

    fun isPsiFileSupported(psiFile: PsiFile): Boolean {
        return fileType.isAssignableFrom(psiFile::class.java)
    }

    override fun editorCreated(event: EditorFactoryEvent) {
        if (event.editor.project != project) return
        val psiFile = PsiDocumentManager.getInstance(project).getPsiFile(event.editor.document) ?: return
        if (!isPsiFileSupported(psiFile)) return
        if (!testMode) {
            // Ignore library sources (eg: files in .jar). Might need extra work to do the same with "node_modules", etc.
            val reviewFile = event.editor.document.file as? ReviewDiffVirtualFile

            if (reviewFile != null) {
                if (!reviewFile.canCreateMarker) return
            } else {
                // next.js file path is like posts/[id].tsx - IntelliJ won't create an uri for this file name!
                if (event.editor.document.uri != null &&
                    event.editor.document.uri?.startsWith("file://") != true) return
            }
        }
        managersByEditor[event.editor] = editorFactory(event.editor)
    }

    override fun editorReleased(event: EditorFactoryEvent) {
        if (event.editor.project != project) return
        managersByEditor.remove(event.editor).also { it?.dispose() }
    }

    override fun dispose() {
        managersByEditor.values.forEach { it.dispose() }
        managersByEditor.clear()
    }

    open fun filterNamespaces(namespaces: List<String>): List<String> = emptyList()

    open fun findSymbol(className: String?, functionName: String?): NavigatablePsiElement? = null

    open suspend fun copySymbolInFile(uri: String, namespace: String?, functionName: String, ref: String?): FindSymbolInFileResponse? {
        val filePath = URI.create(uri).path
        val sha = ref?.let {
            withContext(Dispatchers.EDT) { project.agentService?.getCommit(GetCommitParams(filePath, ref))?.scm?.revision }
        }
        val virtFile = if (sha != null) getCSGitFile(uri, sha, project) else VfsUtil.findFileByURL(URL(uri))

        if (virtFile == null) {
            logger.warn("Could not find file for uri $uri")
            return null
        }

        val psiFile = withContext(Dispatchers.EDT) { virtFile.toPsiFile(project) } ?: return null
        if (!isPsiFileSupported(psiFile)) return null
        val editorManager = FileEditorManager.getInstance(project)
        val result = withContext<FindSymbolInFileResponse?>(Dispatchers.EDT + ModalityState.current().asContextElement()) {
            val editor = editorManager.openTextEditor(OpenFileDescriptor(project, virtFile), false)
                ?: return@withContext null
//        val editor = psiFile.findExistingEditor() ?: return null
            val element =
                (if (namespace != null)
                    symbolResolver.findClassFunctionFromFile(psiFile, null, namespace, functionName)
                else symbolResolver.findTopLevelFunction(psiFile, functionName))
                    ?: return@withContext null
            val document = editor.document
            val start = document.lspPosition(element.textRange.startOffset)
            val end = document.lspPosition(element.textRange.endOffset)
            val range = Range(start, end)
            FindSymbolInFileResponse(element.text, range)
        }
        return result
    }
}
