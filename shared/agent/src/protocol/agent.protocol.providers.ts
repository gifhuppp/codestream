"use strict";
import { RequestType } from "vscode-languageserver-protocol";
import { CrossPostIssueValues } from "./agent.protocol";
import { CodemarkPlus } from "./agent.protocol.codemarks";
import { ReviewPlus } from "./agent.protocol.reviews";
import { CSMarkerLocations } from "./api.protocol";

export interface ThirdPartyProviderConfig {
	id: string;
	name: string; // e.g. "trello"
	host: string;
	apiHost?: string;
	isEnterprise?: boolean;
	forEnterprise?: boolean;
	hasIssues?: boolean;
	hasSharing?: boolean;
	supportsAuth?: boolean;
	needsConfigure?: boolean;
	oauthData?: { [key: string]: any };
	scopes?: string[];
	canFilterByAssignees?: boolean;
}

export interface ThirdPartyDisconnect {
	providerTeamId?: string;
}

export interface ThirdPartyProviders {
	[providerId: string]: ThirdPartyProviderConfig;
}

export interface ConnectThirdPartyProviderRequest {
	providerId: string;
}

export interface ConnectThirdPartyProviderResponse {}

export const ConnectThirdPartyProviderRequestType = new RequestType<
	ConnectThirdPartyProviderRequest,
	ConnectThirdPartyProviderResponse,
	void,
	void
>("codestream/provider/connect");

export interface ConfigureThirdPartyProviderRequest {
	providerId: string;
	data: { [key: string]: any };
}

export interface ConfigureThirdPartyProviderResponse {}

export const ConfigureThirdPartyProviderRequestType = new RequestType<
	ConfigureThirdPartyProviderRequest,
	ConfigureThirdPartyProviderResponse,
	void,
	void
>("codestream/provider/configure");

export interface AddEnterpriseProviderRequest {
	providerId: string;
	host: string;
	data: { [key: string]: any };
}

export interface AddEnterpriseProviderResponse {
	providerId: string;
}

export const AddEnterpriseProviderRequestType = new RequestType<
	AddEnterpriseProviderRequest,
	AddEnterpriseProviderResponse,
	void,
	void
>("codestream/provider/add");

export interface RemoveEnterpriseProviderRequest {
	providerId: string;
}

export const RemoveEnterpriseProviderRequestType = new RequestType<
	RemoveEnterpriseProviderRequest,
	void,
	void,
	void
>("codestream/provider/remove");

export interface DisconnectThirdPartyProviderRequest {
	providerId: string;
	providerTeamId?: string;
}

export interface DisconnectThirdPartyProviderResponse {}

export const DisconnectThirdPartyProviderRequestType = new RequestType<
	DisconnectThirdPartyProviderRequest,
	DisconnectThirdPartyProviderResponse,
	void,
	void
>("codestream/provider/disconnect");

export interface ThirdPartyProviderBoard {
	id: string;
	name: string;
	apiIdentifier?: string;
	assigneesRequired?: boolean;
	assigneesDisabled?: boolean;
	singleAssignee?: boolean;
	[key: string]: any;
}

export interface FetchThirdPartyBoardsRequest {
	providerId: string;
	[key: string]: any;
}

export interface FetchThirdPartyBoardsResponse {
	boards: ThirdPartyProviderBoard[];
}

export const FetchThirdPartyBoardsRequestType = new RequestType<
	FetchThirdPartyBoardsRequest,
	FetchThirdPartyBoardsResponse,
	void,
	void
>("codestream/provider/boards");

export interface ThirdPartyProviderCard {
	id: string;
	title: string;
	body: string;
	url: string;
	modifiedAt: number;
	tokenId: string;
	idList?: string;
	apiIdentifier?: string;
	comments?: number;
	[key: string]: any;
}

export interface FetchThirdPartyCardsRequest {
	providerId: string;
	[key: string]: any;
}

export interface FetchThirdPartyCardsResponse {
	cards: ThirdPartyProviderCard[];
}

export const FetchThirdPartyCardsRequestType = new RequestType<
	FetchThirdPartyCardsRequest,
	FetchThirdPartyCardsResponse,
	void,
	void
>("codestream/provider/cards");

export interface FetchThirdPartyCardWorkflowRequest {
	providerId: string;
	cardId: string;
	[key: string]: any;
}

export interface FetchThirdPartyCardWorkflowResponse {
	workflow: { id: string; name: string }[];
}

export const FetchThirdPartyCardWorkflowRequestType = new RequestType<
	FetchThirdPartyCardWorkflowRequest,
	FetchThirdPartyCardWorkflowResponse,
	void,
	void
>("codestream/provider/cards/workflow");

export interface MoveThirdPartyCardRequest {
	providerId: string;
	cardId: string;
	listId: string;
}

export interface MoveThirdPartyCardResponse {
	success: boolean;
}

export const MoveThirdPartyCardRequestType = new RequestType<
	MoveThirdPartyCardRequest,
	MoveThirdPartyCardResponse,
	void,
	void
>("codestream/provider/cards/move");

export interface UpdateThirdPartyStatusRequest {
	providerId: string;
	providerTeamId: string;
	text: string;
	icon?: string;
	expires?: number;
}

export interface UpdateThirdPartyStatusResponse {
	status: any;
}

export const UpdateThirdPartyStatusRequestType = new RequestType<
	UpdateThirdPartyStatusRequest,
	UpdateThirdPartyStatusResponse,
	void,
	void
>("codestream/provider/status/update");

export interface CreateThirdPartyPostRequest {
	providerId: string;
	providerTeamId: string;
	channelId: string;
	text: string;
	attributes?: any;
	memberIds?: any;
	codemark?: CodemarkPlus;
	review?: ReviewPlus;
	remotes?: string[];
	entryPoint?: string;
	crossPostIssueValues?: CrossPostIssueValues;
	mentionedUserIds?: string[];
}
export interface CreateThirdPartyPostResponse {
	post: any;
}

export const CreateThirdPartyPostRequestType = new RequestType<
	CreateThirdPartyPostRequest,
	CreateThirdPartyPostResponse,
	void,
	void
>("codestream/provider/posts/create");

export const FetchThirdPartyChannelsRequestType = new RequestType<
	FetchThirdPartyChannelsRequest,
	FetchThirdPartyChannelsResponse,
	void,
	void
>("codestream/provider/channels");

export interface FetchThirdPartyChannelsRequest {
	providerId: string;
	providerTeamId: string;
	[key: string]: any;
}

export interface ThirdPartyChannel {
	id: string;
	name: string;
	type: string;
}

export interface FetchThirdPartyChannelsResponse {
	channels: ThirdPartyChannel[];
}

export interface ThirdPartyProviderUser {
	id?: string;
	displayName: string;
	email?: string;
}

export interface FetchAssignableUsersRequest {
	providerId: string;
	boardId: string;
}

export interface FetchAssignableUsersResponse {
	users: ThirdPartyProviderUser[];
}

export const FetchAssignableUsersRequestType = new RequestType<
	FetchAssignableUsersRequest,
	FetchAssignableUsersResponse,
	void,
	void
>("codestream/provider/cards/users");

export interface CreateThirdPartyCardRequest {
	providerId: string;
	data: {
		[key: string]: any;
	};
}

export interface CreateThirdPartyCardResponse {
	[key: string]: any;
}

export const CreateThirdPartyCardRequestType = new RequestType<
	CreateThirdPartyCardRequest,
	CreateThirdPartyCardResponse,
	void,
	void
>("codestream/provider/cards/create");

interface ThirdPartyProviderSetTokenData {
	host?: string;
	token: string;
	data?: { [key: string]: any };
}

export interface ThirdPartyProviderSetTokenRequestData extends ThirdPartyProviderSetTokenData {
	teamId: string;
}

export interface ThirdPartyProviderSetTokenRequest extends ThirdPartyProviderSetTokenData {
	providerId: string;
}

export interface AddEnterpriseProviderHostRequest {
	provider: string;
	teamId: string;
	host: string;
	data: { [key: string]: any };
}

export interface AddEnterpriseProviderHostResponse {
	providerId: string;
}

export interface RemoveEnterpriseProviderHostRequest {
	provider: string;
	providerId: string;
	teamId: string;
}

export interface EnterpriseConfigurationData {
	host?: string;
	baseUrl: string;
	token: string;
}

export interface FetchThirdPartyPullRequestRequest {
	providerId: string;
	providerTeamId?: string;
	pullRequestId: string;

	/**
	 * in the GitHub world, this is `TeamCodeStream` in https://github.com/TeamCodeStream/codestream
	 */
	owner?: string;
	/**
	 * in the GitHub world, this is `codestream` in https://github.com/TeamCodeStream/codestream
	 */
	repo?: string;
}

export interface FetchThirdPartyPullRequestFilesResponse {
	sha: string;
	filename: string;
	status: string;
	additions: number;
	changes: number;
	deletions: number;
	patch?: string;
}

export interface FetchThirdPartyPullRequestPullRequest {
	id: string;
	// this is the parent repo
	repository: {
		name: string;
		nameWithOwner: string;
		url: string;
	};
	body: string;
	baseRefName: string;
	baseRefOid: string;
	author: {
		login: string;
		avatarUrl: string;
	};
	createdAt: string;
	commits: {
		totalCount: number;
		nodes: {
			commit: {
				abbreviatedOid: string;
				author: {
					name: string;
					avatarUrl: string;
					user: {
						login: string;
					};
				};
				message: string;
				authoredDate: string;
			};
		}[];
	};
	files: {
		totalCount: number;
		nodes: {
			path: string;
			additions: number;
			deletions: number;
		}[];
	};
	headRefName: string;
	headRefOid: string;
	labels: {
		nodes: {
			color: string;
			description: string;
			name: string;
		}[];
	};
	number: number;
	state: string;
	reviewRequests: {
		nodes: {
			requestedReviewer: {
				login: string;
				avatarUrl: string;
			};
		}[];
	};
	projectCards: {
		nodes: {
			project: {
				name: string;
			};
		}[];
	};
	reviews: {
		nodes: {
			id: string;
			author: {
				login: string;
				avatarUrl: string;
			};
		}[];
	};
	/**
	 * this is a single pending review for the current user (there can only be 1 at a time for
	 * certain providers, like github)
	 */
	pendingReview: {
		id: string;
		author: {
			login: string;
			avatarUrl: string;
		};
	};
	timelineItems: {
		__typename: string;
		totalCount: number;
		pageInfo: {
			startCursor: string;
			endCursor: string;
			hasNextPage: boolean;
		};
		nodes: any[];
	};
	milestone: {
		title: string;
		state: string;
		number: number;
		id: string;
		description: string;
	};
	participants: {
		nodes: {
			avatarUrl: string;
		}[];
	};
	assignees: {
		nodes: {
			avatarUrl: string;
			id: string;
			name: string;
			login: string;
		}[];
	};
	mergeable: string;
	merged: boolean;
	mergedAt: string;
	title: string;
	url: string;
	repoUrl: string;
	baseUrl: string;
	updatedAt: string;
	reactionGroups: any;
	includesCreatedEdit: boolean;
}

export interface FetchThirdPartyPullRequestRepository {
	id: string;
	url: string;
	resourcePath: string;
	rebaseMergeAllowed: boolean;
	squashMergeAllowed: boolean;
	mergeCommitAllowed: boolean;
	repoOwner: string;
	repoName: string;
	pullRequest: FetchThirdPartyPullRequestPullRequest;
}

export interface FetchThirdPartyPullRequestResponse {
	rateLimit: {
		limit: any;
		cost: any;
		remaining: any;
		resetAt: any;
	};
	repository: FetchThirdPartyPullRequestRepository;
}

export const FetchThirdPartyPullRequestRequestType = new RequestType<
	FetchThirdPartyPullRequestRequest,
	FetchThirdPartyPullRequestResponse,
	void,
	void
>("codestream/provider/pullrequest");

export interface ExecuteThirdPartyRequest {
	method: string;
	providerId: string;
	params: any;
}

export interface ExecuteThirdPartyResponse {}

export const ExecuteThirdPartyRequestUntypedType = new RequestType<
	ExecuteThirdPartyRequest,
	ExecuteThirdPartyResponse,
	void,
	void
>("codestream/provider/generic");

export class ExecuteThirdPartyTypedType<Req, Res> extends RequestType<
	ExecuteThirdPartyTypedRequest<Req>,
	Res,
	any,
	any
> {
	constructor() {
		super("codestream/provider/generic");
	}
}

export interface GetMyPullRequestsRequest {
	owner?: string;
	name?: string;
	/** if true, only return PRs that are open */
	isOpen?: boolean;
	/**
	 * forces a re-fetch from the provider
	 */
	force?: boolean;
}

export interface GetMyPullRequestsResponse {
	id: string;
	url: string;
	title: string;
	createdAt: number;
	author: {
		login: string;
		avatarUrl: string;
	};
	bodyText: string;
	number: number;
	state: string;
	updatedAt: string;
	lastEditedAt: string;
}

export type MergeMethod = "MERGE" | "SQUASH" | "REBASE";

export interface MergePullRequestRequest {
	pullRequestId: string;
	mergeMethod: MergeMethod;
}

export interface CreatePullRequestCommentRequest {
	pullRequestId: string;
	text: string;
}

export interface CreatePullRequestCommentAndCloseRequest {
	pullRequestId: string;
	text: string;
}

export interface ExecuteThirdPartyTypedRequest<T> {
	method: string;
	providerId: string;
	params?: T;
}
