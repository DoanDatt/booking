-- Partial Unique Index: chỉ bắt unique trên các bản ghi CHƯA bị xoá mềm (deletedAt IS NULL).
-- Nhờ vậy xoá mềm 1 bản ghi rồi tạo lại cùng giá trị vẫn được.
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

-- Đặt phòng
CREATE UNIQUE INDEX "City_slug_unique"
ON "City" (slug)
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Amenity_name_unique"
ON "Amenity" (name)
WHERE "deletedAt" IS NULL;
