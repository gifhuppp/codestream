"use strict";
import { Range, RequestType, TextDocumentIdentifier } from "vscode-languageserver-protocol";
import { CodeDelimiterStyles } from "./agent.protocol";
import {
	CodemarkPlus,
	CreateCodemarkRequest,
	CreateCodemarkResponse
} from "./agent.protocol.codemarks";
import { ThirdPartyProviderUser } from "./agent.protocol.providers";
import { CreateReviewRequest, ReviewPlus } from "./agent.protocol.reviews";
import {
	CodemarkType,
	CSCodemark,
	CSMarker,
	CSMarkerLocations,
	CSPost,
	CSReactions,
	CSRepository,
	CSStream,
	CSReview
} from "./api.protocol";

export interface PostPlus extends CSPost {
	codemark?: CodemarkPlus;
	review?: CSReview;
	hasMarkers?: boolean;
}

export interface CreateExternalPostRequest {
	streamId: string;
	text: string;
	mentionedUserIds?: string[];
	parentPostId?: string;
	remotes?: string[];
	entryPoint?: string;
	codemarkResponse?: CreateCodemarkResponse;
	crossPostIssueValues?: CrossPostIssueValues;
}

export interface CreateSharedExternalPostRequest {
	channelId: string;
	text: string;
	mentionedUserIds?: string[];
	parentPostId?: string;
	remotes?: string[];
	entryPoint?: string;
	codemark?: CodemarkPlus;
	crossPostIssueValues?: CrossPostIssueValues;
}

export interface CreatePostRequest {
	streamId: string;
	text: string;
	mentionedUserIds?: string[];
	parentPostId?: string;
	codemark?: CreateCodemarkRequest;
	review?: CreateReviewRequest;
	entryPoint?: string;
	crossPostIssueValues?: CrossPostIssueValues;
	dontSendEmail?: boolean;
}

export interface CrossPostIssueValues {
	externalProvider?: string;
	externalProviderHost?: string;
	externalProviderUrl?: string;
	assignees?: ThirdPartyProviderUser[];
	codeDelimiterStyle?: CodeDelimiterStyles;
	issueProvider: { name: string; id: string; host: string };
	[key: string]: any;
}

export interface CreatePostResponse {
	post: PostPlus;
	review?: ReviewPlus;
	codemark?: CodemarkPlus;
	markers?: CSMarker[];
	markerLocations?: CSMarkerLocations[];
	streams?: CSStream[];
	repos?: CSRepository[];
}
export const CreatePostRequestType = new RequestType<
	CreatePostRequest,
	CreatePostResponse,
	void,
	void
>("codestream/posts/create");

export interface CodeBlockSource {
	file: string;
	repoPath: string;
	revision: string;
	authors: { id: string; username: string }[];
	remotes: { name: string; url: string }[];
	branch?: string;
}
export interface CreatePostWithMarkerRequest {
	textDocuments: TextDocumentIdentifier[];
	text: string;
	mentionedUserIds?: string[];
	markers: {
		code: string;
		range?: Range;
		source?: CodeBlockSource;
		documentId: TextDocumentIdentifier;
	}[];
	parentPostId?: string;
	streamId: string;
	title?: string;
	type: CodemarkType;
	assignees?: string[];
	status?: string;
	entryPoint?: string;
	tags?: string[];
	relatedCodemarkIds?: string[];
	crossPostIssueValues?: CrossPostIssueValues;
}

export const CreatePostWithMarkerRequestType = new RequestType<
	CreatePostWithMarkerRequest,
	CreatePostResponse,
	void,
	void
>("codestream/posts/createWithCodemark");

export interface FetchPostRepliesRequest {
	streamId: string;
	postId: string;
}
export interface FetchPostRepliesResponse {
	posts: CSPost[];
	codemarks?: CSCodemark[];
}
export const FetchPostRepliesRequestType = new RequestType<
	FetchPostRepliesRequest,
	FetchPostRepliesResponse,
	void,
	void
>("codestream/post/replies");

export interface FetchPostsRequest {
	streamId: string;
	limit?: number;
	after?: number | string; // equiv to slack.oldest
	before?: number | string; // equiv to slack.latest
	inclusive?: boolean;
}
export interface FetchPostsResponse {
	posts: PostPlus[];
	codemarks?: CodemarkPlus[];
	markers?: CSMarker[];
	reviews?: CSReview[];
	more?: boolean;
}
export const FetchPostsRequestType = new RequestType<
	FetchPostsRequest,
	FetchPostsResponse,
	void,
	void
>("codestream/posts");

export interface FetchActivityRequest {
	limit?: number;
	before?: string;
}

export interface FetchActivityResponse {
	posts: PostPlus[];
	codemarks: CodemarkPlus[];
	reviews: CSReview[];
	records: string[];
	more?: boolean;
}

export const FetchActivityRequestType = new RequestType<
	FetchActivityRequest,
	FetchActivityResponse,
	void,
	void
>("codestream/posts/activity");

export interface DeletePostRequest {
	streamId: string;
	postId: string;
}
export interface DeletePostResponse {
	post: CSPost;
}
export const DeletePostRequestType = new RequestType<
	DeletePostRequest,
	DeletePostResponse,
	void,
	void
>("codestream/post/delete");

export interface EditPostRequest {
	streamId: string;
	postId: string;
	text: string;
	mentionedUserIds?: string[];
}

export interface EditPostResponse {
	post: CSPost;
}

export const EditPostRequestType = new RequestType<EditPostRequest, EditPostResponse, void, void>(
	"codestream/post/edit"
);

export interface GetPostRequest {
	streamId: string;
	postId: string;
}

export interface GetPostResponse {
	post: PostPlus;
}

export const GetPostRequestType = new RequestType<GetPostRequest, GetPostResponse, void, void>(
	"codestream/post"
);

export interface GetPostsRequest {
	streamId: string;
	postIds: string[];
	parentPostId?: string;
}

export interface GetPostsResponse {
	posts: CSPost[];
}

export const GetPostsRequestType = new RequestType<GetPostsRequest, GetPostsResponse, void, void>(
	"codestream/posts/byIds"
);

export interface MarkPostUnreadRequest {
	streamId: string;
	postId: string;
}

export interface MarkPostUnreadResponse {}

export const MarkPostUnreadRequestType = new RequestType<
	MarkPostUnreadRequest,
	MarkPostUnreadResponse,
	void,
	void
>("codestream/post/markUnread");

export interface ReactToPostRequest {
	streamId: string;
	postId: string;
	emojis: CSReactions;
}

export interface ReactToPostResponse {
	post: CSPost;
}

export const ReactToPostRequestType = new RequestType<
	ReactToPostRequest,
	ReactToPostResponse,
	void,
	void
>("codestream/post/react");
