/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { Response } from 'express';

interface ResponseData<T> {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: any | null;
    data?: T | null;
  }
  
export const sendResponse = <T>(res: Response, data: ResponseData<T>): void => {
  const responseData: ResponseData<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null,
    data: data.data || null,
  };

  res.status(data.statusCode).json(responseData);
};