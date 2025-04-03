export interface IProductVariant {
    _id: string;
    productId: string; // Liên kết tới IProduct._id
    sku: string;
    price: number;
    color: IColor;
    images: IImages;
    sizes: ISize[];
    createdAt: string;
    updatedAt: string;
}

export interface IColor {
    baseColor: string;
    actualColor: string;
    colorName: string;
}

export interface IImages {
    main: string;
    hover: string;
    product: string[];
}

export interface ISize {
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    stock: number;
}
