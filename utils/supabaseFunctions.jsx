import { supabase } from "./supabase";

export const getAllTodos = async () => {
  const { data } = await supabase.from("study-record").select();
  return data;
};
