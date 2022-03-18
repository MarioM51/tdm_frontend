import type { IBlogRepository } from "./BlogRepository";
import type { BlogModel } from "./blog_models";

import ErrorModel from "../error/ErrorModel";
import { BlogRepository } from "./BlogRepository";

export default interface IBlogService {

  findAll():Promise<BlogModel[]>

  findById(id: number): Promise<BlogModel>;

  save(newBlog: BlogModel): Promise<BlogModel>;

  edit(newInfo: BlogModel): Promise<BlogModel>;

  deletePost(toDel: BlogModel): Promise<BlogModel>;

}

export class BlogService implements IBlogService {

  private static instance:IBlogService = null;

  private readonly _blogRepo:IBlogRepository = BlogRepository.getInstance();

  private constructor() { }

  public static getInstance():IBlogService {
    if(BlogService.instance == null) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }


  public async findAll():Promise<BlogModel[]> {
    const blogs = await this._blogRepo.findAll();

    return blogs;
  }

  public async findById(id: number): Promise<BlogModel> {
    const finded = await this._blogRepo.findById(id);

    return finded;
  }

  public async save(newBlog: BlogModel): Promise<BlogModel> {
    const saved = await this._blogRepo.save(newBlog);

    return saved;
  }

  public async edit(newInfo: BlogModel): Promise<BlogModel> {
    const edited = await this._blogRepo.edit(newInfo);

    return edited;
  }

  public async deletePost(toDel: BlogModel): Promise<BlogModel> {
    const deleted = await this._blogRepo.deletePost(toDel);

    return deleted;
  }

}
