export interface BaseCollaborationResponse {
	[key: string]: {
		id: string;
	};
}

export interface CollaborationContextMetadata {
	accountId: number;
	entityGuid: string;
	nerdletId: string;
	pageId: string[];
	codeMarkId?: string;
}

export interface CollaborationContext {
	id: string;
	metaData: CollaborationContextMetadata;
}

export interface BootStrapResponse {
	threadId: string;
	context: CollaborationContext;
}

export interface CommentsByThreadIdResponse {
	actor: {
		collaboration: {
			commentsByThreadId: {
				entities: {
					body: string;
					deactivated: boolean;
					id: string;
					systemMessageType: string;
					createdAt: number;
					creator: {
						email: string;
						name: string;
						userId: number;
					};
				}[];
			};
		};
	};
}

export interface ThreadsByContextIdResponse {
	actor: {
		collaboration: {
			threadsByContextId: {
				entities: {
					deactivated: boolean;
					id: string;
					latestCommentTime: number;
					status: string;
				}[];
			};
		};
	};
}
