import fetch from 'node-fetch';
import JSONdb from 'simple-json-db';

export let meliAccToken: object = {};
export let meliRefToken: object = {};

export async function meliAuth(): Promise<void> {
  const db = new JSONdb('./keys.json');
  meliAccToken = db.get('access_token');
  meliRefToken = db.get('refresh_token');
  let bodyF: object = {
    price: 99999
  }
  const url: string = 'https://api.mercadolibre.com/items/MLA604071858';
  let bearerBodyPut: object = {
    method: 'PUT',
    headers: {
      "Authorization": "Bearer " + meliAccToken,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(bodyF)
  }
  let firstFetch = await fetch(url, bearerBodyPut)
  const body: any = await firstFetch.json()
  if (body.status === 'active') {
    console.log('Auth OK')
  }
  //console.log(body)
  if (body.status !== "active") {
    let refreshBody: object = {
      method: 'POST',
      headers: {
        "Accept": "applicaction/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=refresh_token&client_id=2340107073954024&client_secret=eA3gvdKs6NCXHlKVs8gfeuuJ192dw8hh&refresh_token=${meliRefToken}`
    }
    let tokenUrl: string = 'https://api.mercadolibre.com/oauth/token'
    let token = await fetch(tokenUrl, refreshBody);
    let data: any = await token.json()
    db.set('access_token', data.access_token);
    db.set('refresh_token', data.refresh_token);
    meliAccToken = db.get('access_token');
    //console.log(data)
    console.log('Auth Refresh OK')

  }
}