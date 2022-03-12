import ErrorModel from "../error/ErrorModel";
import type { BlogModel } from "./blog_models";

export default interface IBlogService {

  findAll():Promise<BlogModel[]>

  findById(id: number): Promise<BlogModel>;

  save(newBlog: BlogModel): Promise<BlogModel>;

  edit(newInfo: BlogModel): Promise<BlogModel>;

  deletePost(toDel: BlogModel): Promise<BlogModel>;

}

export class BlogService implements IBlogService {

  private static instance:IBlogService = null;

  private readonly allBlogs:BlogModel[] = [
  
  ]

  private constructor() { }

  public static getInstance():IBlogService {
    if(BlogService.instance == null) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }


  public async findAll():Promise<BlogModel[]> {
    
    const blogsReq = await new Promise<BlogModel[]>((resolve, reject) => {
      
      setTimeout(()=>{
        resolve(this.allBlogs);
      }, 1000);
      
      setTimeout(()=>{
        reject(new ErrorModel(400, "Erro test"));
      },1100);

    });

    return blogsReq;
  }

  public async findById(id: number): Promise<BlogModel> {
    const blogsReq = await new Promise<BlogModel>((resolve, reject) => {
      
      setTimeout(()=>{
        const blogFinded = this.allBlogs.find(b => b.id == id);
        let clonedObject = Object.assign({}, blogFinded);
        resolve(clonedObject);
      }, 1000);
      
      setTimeout(()=>{
        reject(new ErrorModel(400, "Erro test"));
      },1100);

    });

    return blogsReq;
  }

  public async save(newBlog: BlogModel): Promise<BlogModel> {

    const addReq = await new Promise<BlogModel>((resolve, reject) => {
      
      setTimeout(()=>{
        this.allBlogs.push(newBlog)
        newBlog.id = this.allBlogs.length + 1;
        resolve(newBlog);
      }, 1000);
      
      setTimeout(()=>{
        reject(new ErrorModel(400, "Erro test"));
      },1100);

    });

    return addReq;
  }

  public async edit(newInfo: BlogModel): Promise<BlogModel> {
    const editReq = await new Promise<BlogModel>((resolve, reject) => {
      
      setTimeout(()=>{
        
        const i = this.allBlogs.findIndex(b => b.id == newInfo.id)
        this.allBlogs[i] = newInfo;

        resolve(this.allBlogs[i]);
      }, 1000);
      
      setTimeout(()=>{
        reject(new ErrorModel(400, "Erro test"));
      },1100);

    });

    return editReq;
  }

  public async deletePost(toDel: BlogModel): Promise<BlogModel> {
    const editReq = await new Promise<BlogModel>((resolve, reject) => {
      
      setTimeout(()=>{
        
        const i = this.allBlogs.findIndex(b => b.id == toDel.id)
        this.allBlogs.splice(i, 1);

        resolve(toDel);
      }, 1000);
      
      setTimeout(()=>{
        reject(new ErrorModel(400, "Erro test"));
      },1100);

    });

    return editReq;
  }

}