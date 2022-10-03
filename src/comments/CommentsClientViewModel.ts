import { get, Readable, writable, Writable } from "svelte/store";
import CommentModel from "./CommentModel";
import UIAsyncCollection, { UIUpdateTypeItem } from "../helpers/UIHelper";
import type ICommentService from "./ICommentService";
import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";

export default class CommentViewModel {

  //tools
  private readonly _commentServ: ICommentService;
  private readonly _authVM: IAuthViewModel;

  //UI elements
  private readonly _uiListComments: UIAsyncCollection<CommentModel> = null;
  public readonly _errorMsg: Writable<string> = null;

  constructor(commentsPreloaded: CommentModel[] = [], commentServImpl: ICommentService) {
    this._commentServ = commentServImpl;
    this._errorMsg = writable(``);
    const commentsWithResponse = CommentModel.mergeResponsesIntoComments(commentsPreloaded);
    commentsWithResponse.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    this._uiListComments = new UIAsyncCollection(commentsWithResponse, this._errorMsg);
    this._authVM = AuthViewModel.getInstance();
  }

  public async add(newComment: CommentModel): Promise<CommentModel> {
    const userLogged = get(this._authVM.getSession());
    if (userLogged == null) {
      this._authVM.logout("session_required");
      return;
    }
    newComment.idUser = userLogged.id;
    const addReq = this._commentServ.addComment(newComment);
    const updateType = UIUpdateTypeItem.ADD_TO_START;

    const added = await this._uiListComments.updateItemAsync(null, addReq, updateType);
    return added
  }

  public addResponse(newResponse: CommentModel): void {
    if (newResponse.responseTo <= 0) {
      this._errorMsg.set("Error inesperado (2bu2j9): intente mas tarde")
      return
    }
    const userLogged = get(this._authVM.getSession());
    if (userLogged == null) {
      this._authVM.logout("session_required");
      return;
    }
    newResponse.idUser = userLogged.id;
    const addReq = this._commentServ.addResponse(newResponse);
    this._uiListComments._addReq.set(addReq);

    addReq
      .then(responseSaved => {
        this._uiListComments._allItemsInUI.update(comments => {
          const commentResponded = comments.find(c => c.id == responseSaved.responseTo)
          commentResponded.responses.push(responseSaved);
          return comments;
        });
      })
      .catch(err => {
        this._uiListComments.handleGenericError(err);
      })
      .finally(() => {
        this._uiListComments._addReq.set(addReq);
      })


  }

  public remove(toDel: CommentModel): Promise<CommentModel> {
    const removeRequest = this._commentServ.removeComment(toDel);

    removeRequest
      .then(removed => {
        this._uiListComments._allItemsInUI.update(comments => {
          const filtered = comments.filter(c => c.id != removed.id);
          if (comments.length == filtered.length) {
            for (let i = 0; i < filtered.length; i++) {
              const responsesFiltered = comments[i].responses.filter(c => c.id != removed.id);
              if (filtered[i].responses.length != responsesFiltered.length) {
                filtered[i].responses = responsesFiltered;
                break;
              }
            }
          }
          return filtered;
        })
      })

    return removeRequest;
  }

  //Getters/Setters
  public getAll(): Readable<CommentModel[]> {
    return this._uiListComments.getItemsObserver();
  }

  public getAllReq(): Readable<Promise<CommentModel[]>> {
    return this._uiListComments.getRemplaceAllReq();
  }

  public getAddReq(): Readable<Promise<CommentModel[]>> {
    return this._uiListComments.getAddReq();
  }

  public getDeleteReq(): Readable<Array<Promise<CommentModel>>> {
    return this._uiListComments.getDeleteReq();
  }

}