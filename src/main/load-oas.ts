import {OpenApiSpec} from '../models/open-api-spec';
import {v4} from 'uuid';
import windowSender from './window-sender';

/**
 * Load oas from window using asyncSend. Needs to be tested
 */
export async function loadOas(): Promise<OpenApiSpec[]> {
  const id = v4();
  try {
    const response = await windowSender.asyncSend("load-oas", id);
    return response;
  } catch (error) {
    console.error(error);
  }
}