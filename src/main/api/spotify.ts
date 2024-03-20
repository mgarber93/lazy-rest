import fetch from 'node-fetch';

// https://developer.spotify.com/dashboard/2c06c406715e489ca12423effe1b1733/settings
export async function serviceToService(): Promise<string> {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const buffer = Buffer.from(`${client_id}:${client_secret}`);
  
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + buffer.toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  };
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    if (!response.ok) throw new Error('Network response was not ok.');
    const result = await response.json() as { access_token: string };
    const token = result.access_token;
    return token;
  } catch (error) {
    console.log('There has been a problem getting token: ', error);
    throw new Error('Problem calling spotify')
  }
}

export async function get(endpoint: string): Promise<object> {
  try {
    const token = await serviceToService();
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, options);
    if (response.ok) {
      const data = await response.json() as object;
      return data;
    } else {
      return {
        statusCode: response.status,
        statusText: response.statusText,
      };
    }
    
    
  } catch (e) {
    throw new Error('Problem calling spotify')
  }
}