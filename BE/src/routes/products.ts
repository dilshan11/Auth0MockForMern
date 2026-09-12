import { Router, Request, Response } from "express";
import { Product, products } from "../data/products";

const router = Router();

function validateProductInput(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "Request body must be an object";
  }
  const { name, description, price, image } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    return "'name' is required and must be a non-empty string";
  }
  if (typeof description !== "string" || description.trim() === "") {
    return "'description' is required and must be a non-empty string";
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return "'price' is required and must be a non-negative number";
  }
  if (typeof image !== "string" || image.trim() === "") {
    return "'image' is required and must be a non-empty string";
  }

  return null;
}

router.get("/", (_req: Request, res: Response) => {
  res.json(products);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

router.post("/", (req: Request, res: Response) => {
  const validationError = validateProductInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { name, description, price, image } = req.body as Omit<Product, "id">;
  const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const product: Product = { id: nextId, name, description, price, image };

  products.push(product);
  res.status(201).json(product);
});

router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const validationError = validateProductInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { name, description, price, image } = req.body as Omit<Product, "id">;
  product.name = name;
  product.description = description;
  product.price = price;
  product.image = image;

  res.json(product);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const [deleted] = products.splice(index, 1);
  res.json(deleted);
});

export default router;
