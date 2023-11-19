import { User } from "#models/User.js";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";

export const updateAvatar = async (req, res, next) => {
  const { userId } = req.user;
  const { file } = req;

  try {
    console.log(file);
    const currentFilePath = new URL(import.meta.url).pathname;
    const currentDir = path.dirname(currentFilePath);

    const imagePath = file.path;
    const outputDir = path.join(currentDir, "../../public/avatars");
    const outputImagePath = path.join(outputDir, file.filename);

    await fs.mkdir(outputDir, { recursive: true });

    const image = await Jimp.read(imagePath);
    await image.resize(250, 250).write(outputImagePath);

    const avatarURL = `/avatars/${file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, { avatarURL }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ avatarURL: updatedUser.avatarURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};
