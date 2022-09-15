import { get, Readable, writable, Writable } from "svelte/store";
import type CommentModel from "./CommentModel";
import UIAsyncCollection, { UIUpdateTypeItem } from "../helpers/UIHelper";
import type ICommentService from "./ICommentService";
import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";

export default class CommentViewModel {

  //tools
  private readonly _commentServ:ICommentService;
  private readonly _authVM:IAuthViewModel;

  //UI elements
  private readonly _uiListComments:UIAsyncCollection<CommentModel> = null;
  private readonly _errorMsg:Writable<string> = null;

  constructor(commentsPreloaded:CommentModel[]=[], commentServImpl: ICommentService){
    this._commentServ = commentServImpl;
    this._errorMsg = writable(null);
    this._uiListComments = new UIAsyncCollection(commentsPreloaded, this._errorMsg);
    this._authVM = AuthViewModel.getInstance();
  }

  public add(newComment:CommentModel):void {
    const userLogged = get(this._authVM.getSession());
    if(userLogged == null) {
      this._authVM.logout("session_required");
      return ;
    }
    newComment.idUser = userLogged.id;
    const addReq = this._commentServ.addComment(newComment);
    const updateType = UIUpdateTypeItem.ADD_TO_START;

    this._uiListComments.getItemsObserver()

    this._uiListComments.updateItemAsync(null, addReq, updateType);
  }

  public remove(toDel:CommentModel):void {
    const removeRequest = this._commentServ.removeComment(toDel);
    const updateType = UIUpdateTypeItem.DELETE;

    this._uiListComments.updateItemAsync(toDel, removeRequest, updateType);
  }

  //Getters/Setters
  public getAll():Readable<CommentModel[]> {
    return this._uiListComments.getItemsObserver();
  }

  public getAllReq():Readable<Promise<CommentModel[]>> {
    return this._uiListComments.getRemplaceAllReq();
  }

  public getAddReq():Readable<Promise<CommentModel[]>> {
    return this._uiListComments.getAddReq();
  }

  public getDeleteReq():Readable<Array<Promise<CommentModel>>> {
    return this._uiListComments.getDeleteReq();
  }

}