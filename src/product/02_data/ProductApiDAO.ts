import ErrorModel from "../../error/ErrorModel";
import ProductModel from "../01_model/ProductModel";

export default class ProductApiDAO {
  public add(toAdd:ProductModel): Promise<ProductModel> {
    return new Promise<ProductModel>((rs, rj) => {
      setTimeout(()=>{
        rs(toAdd);
      },1000);
      setTimeout(()=>{
        rj(new ErrorModel(400, "Error test"));
      },1200);
    });
  }

  public findAll() : Promise<ProductModel[]> {

    return new Promise<ProductModel[]>((rs, rj) => {
      setTimeout(()=>{
        rs([
          new ProductModel("Producto 1", 50.5, "imagen1.png", "descripcion 1"),
          new ProductModel("Producto 2", 150.5, "imagen2.png", "descripcion 2"),
          new ProductModel("Producto 3", 250.5, "imagen3.png", "descripcion 3"),
          new ProductModel("Producto 4", 350.5, "imagen4.png", "descripcion 4"),
          new ProductModel("Producto 5", 450.5, "imagen5.png", "descripcion 5"),
          new ProductModel("Producto 6", 550.5, "imagen6.png", "descripcion 6"),
        ]);
      },1100);
      setTimeout(()=>{
        rj(new ErrorModel(400, "Error test"));
      },1000);
    });

  }


}