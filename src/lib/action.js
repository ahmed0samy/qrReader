"use server";

import { revalidatePath } from "next/cache";
// import { Post, User } from "./models";
import { connectToDb } from "./utils";
import { Operation, Product } from "./models";

export async function RegisterProduct({ name, img, code, price, amount }) {
  console.log({ name, code, img, price });
  try {
    connectToDb();
    const product = new Product({ name, amount, code, img, price });
    await product.save().then(() => {
      console.log('saved successfully')
    })
  } catch(err) {
    console.log(err)
  }
}
export async function GetProductDetailsByCode(code){
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~', code)
  try {
    connectToDb()
    const product = await Product.findOne({code})
    
    console.log(product)
    return product? JSON.stringify(product): 'undefined'
  } catch(err){
    console.log(err)
  }
}



export async function submitOperation(obj){
  try {
    connectToDb()
    const op = {
      products: [...obj],
      accountId: 'ssss',
      type: 1
    }
    const operation = new Operation(op)
    operation.save()
    console.log('operation saved successfully with ID', operation._id)
    revalidatePath('/')

  } catch(err){
    console.log(err)
  }
  
}


export const addPost = async (prevState, formData) => {
  // const title = formData.get("title");
  // const desc = formData.get("desc");
  // const slug = formData.get("slug");

  const { title, desc, slug, userId } = Object.fromEntries(formData);

  try {
    connectToDb();
    const newPost = new Post({
      title,
      desc,
      slug,
      userId,
    });

    await newPost.save();
    // console.log("saved to db");
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deletePost = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDb();

    await Post.findByIdAndDelete(id);
    // console.log("deleted from db");
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDb();

    await Post.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    revalidatePath("/admin");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const register = async (previousState, formData) => {
  const { username, email, password, img, passwordRepeat } =
    Object.fromEntries(formData);

  if (password !== passwordRepeat) {
    return { error: "Passwords do not match" };
  }

  try {
    connectToDb();

    const user = await User.findOne({ username });

    if (user) {
      return { error: "Username already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      img,
    });

    await newUser.save();
    console.log("saved to db");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

export const addHandle = async (previousState, formData) => {
  const { handle, id } = Object.fromEntries(formData);
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const codeforcesRes = await res.json();
  if (codeforcesRes.status == "FAILED") {
    return { error: "This handle does not exist on codeforces" };
  }
  try {
    connectToDb();
    // console.log(handle);
    // console.log(id);

    const user = await User.findOne({ handle });

    if (user) {
      console.log("Handle already exists");
      return { error: "Handle already exists" };
    }

    const newUser = await User.findById(id);
    newUser.handle = handle;
    await newUser.save();
    console.log("saved to db");
    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong with handle!" };
  }
};

export const login = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    console.log(err);

    if (err.message.includes("CredentialsSignin")) {
      return { error: "Invalid username or password" };
    }
    throw err;
  }
};

export async function isAdmin(email) {
  const user = await User.findOne({ email });
  return user.isAdmin;
}

export async function UpdateContent(content) {
  const id = "678567;huoikzdfvl;jiksdfaasdfV:Oi39";
  connectToDb();
  const isExsisted = await Post.findOne({ id });
  if (isExsisted) {
    try {
      await Post.findOneAndUpdate({ id }, { content });
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong!" + err };
    }
  } else {
    try {
      const newPost = new Post({ id, content });
      await newPost.save();
      console.log("saved to db");
    } catch (err) {
      console.log(err);
      return { error: "Something went wrong!" };
    }
  }
}

export async function getContent() {
  const id = "678567;huoikzdfvl;jiksdfaasdfV:Oi39";
  connectToDb();
  try {
    const isExsisted = await Post.findOne({ id });
    return isExsisted.content;
  } catch (err) {
    console.log(err);
    return err;
  }
}
