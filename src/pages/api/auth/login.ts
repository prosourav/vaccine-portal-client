import authService from '@/services/authService'
import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function Handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const data = req.body;
  try {
    const response = await authService.login(data);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(error.response.status ).json(error.response.data);
  }
}