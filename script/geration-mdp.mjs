import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("lacasitadelapaella", 12);

console.log(hash);
