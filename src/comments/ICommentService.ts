import type CommentModel from "./CommentModel";

export default interface ICommentService {

  addComment(newComment: CommentModel): Promise<CommentModel>;

  removeComment(toDel: CommentModel): Promise<CommentModel>;

  addResponse(newResponse: CommentModel): Promise<CommentModel>;

}