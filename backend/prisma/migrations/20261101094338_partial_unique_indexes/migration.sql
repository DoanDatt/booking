-- Partial Unique Index: chỉ bắt unique trên các bản ghi CHƯA bị xoá mềm (deletedAt IS NULL).
-- Nhờ vậy xoá mềm 1 user rồi đăng ký lại cùng email vẫn được.
-- Prisma Schema không hỗ trợ tính năng này nên phải viết SQL tay.

CREATE UNIQUE INDEX "User_email_unique"
ON "User" (email)
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Role_name_unique"
ON "Role" (name)
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX permission_path_method_unique
ON "Permission" (path, method)
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "BrandTranslation_brandId_languageId_unique"
ON "BrandTranslation" ("brandId", "languageId")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "CategoryTranslation_categoryId_languageId_unique"
ON "CategoryTranslation" ("categoryId", "languageId")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "ProductTranslation_productId_languageId_unique"
ON "ProductTranslation" ("productId", "languageId")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "SKU_productId_value_unique"
ON "SKU" ("productId", "value")
WHERE "deletedAt" IS NULL;
