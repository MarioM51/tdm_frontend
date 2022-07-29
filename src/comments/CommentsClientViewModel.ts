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
  private readonly _all:UIAsyncCollection<CommentModel> = null;
  private readonly _errorMsg:Writable<string> = null;

  constructor(commentsPreloaded:CommentModel[]=[], commentServImpl: ICommentService){
    this._commentServ = commentServImpl;
    this._errorMsg = writable(null);
    this._all = new UIAsyncCollection(commentsPreloaded, this._errorMsg);
    this._authVM = AuthViewModel.getInstance();
  }

  public add(newComment:CommentModel):void {
    newComment.idUser = get(this._authVM.getSession()).id;
    const addReq = this._commentServ.addComment(newComment);
    const updateType = UIUpdateTypeItem.ADD_TO_START;

    this._all.showItemOfCollectionRequest(addReq, updateType);
  }

  public remove(toDel:CommentModel):void {
    const removeRequest = this._commentServ.removeComment(toDel);
    const updateType = UIUpdateTypeItem.DELETE;

    this._all.showItemOfCollectionRequest(removeRequest, updateType);
  }

  //Getters/Setters
  public getAll():Readable<CommentModel[]> {
    return this._all.getObsValue();
  }

  public getAllReq():Readable<Promise<CommentModel[]>> {
    return this._all.getRemplaceReq();
  }

  public getAddReq():Readable<Promise<CommentModel[]>> {
    return this._all.getAddReq();
  }

  public getDeleteReq():Readable<Promise<CommentModel[]>> {
    return this._all.getDeleteReq();
  }

}