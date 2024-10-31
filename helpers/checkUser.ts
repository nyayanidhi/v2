import getServerUser from "@/helpers/getServerUser";

import axios from "axios";

export async function checkUser(emailId: string) {
  try {
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/newuser`,
      JSON.stringify({ email_id: emailId }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.status !== 200 && resp.status !== 201) {
      return {
        success: false,
        data: "Oops! Something didnt work",
      };
    }

    const data = await resp.data;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: error.message };
  }
}
