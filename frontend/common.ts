/** REACT */


/** API REQUESTS */


declare type CartItem;


/** this is an example of what the cart object looks like, but it can be any structure
 * the important is that it contains the basic elements of a cart
 * items, currency and shippingCost, items containing the product id and quantity, sku, unit price,unit of measure etc
 */
export interface NaiveCart {
    items: CartItem[];
    currency: string;
    shippingCost: number;
}

/**
 * token and user can be anything you want, depends on the structure of your regular login api
 * punchoutId is the id of the punchout session, it is used to identify the user in the punchout session
 */
export interface PunchoutLoginResponse {
    token: string;
    punchoutId: string;
}


const baseUrl = 'https://api.example.com';

export async function punchoutLogin(punchoutId: string): Promise<PunchoutLoginResponse> {
    const res = await (await fetch(baseUrl + '/punchout/login', {
        body: JSON.stringify({ punchoutId }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })).text();

    try {
        return JSON.parse(res);
    } catch (e) {
        throw new Error(res);
    }
}


export interface CartResponse {
    message: string;
    url: string;
    data: { [key: string]: string },
}



export class PunchoutCartService {

    _block: any;


    private async punchoutCart(data: NaiveCart): Promise<CartResponse> {


        let punchoutId = 'TODO' // from local storage if you opt for passing it in query param

        const res = await (await fetch(baseUrl + `/punchout/cart?id=${punchoutId}`, {
            body: JSON.stringify({ cart: { Ikea: data }, custom: {} }),
            method: 'POST',
            headers: {
                'Authorization': 'Bearer TODO:BEARERTOKEN if you opt for getting punchoutId from jwt',
                'Content-Type': 'application/json',
            },
        })).text();

        try {
            return JSON.parse(res);
        } catch (e) {
            throw new Error(res);
        }
    }

    async submitCart(cart: NaiveCart) {
        try {
            this.showBlock();
            const res = await this.punchoutCart(cart);
            if (!res.url || !res.data) {
                alert(res.message || 'An error happened with punchout');
                this.hideBlock();
                return;
            }
            const form = this.createPunchoutForm(res);
            localStorage.clear();

            form.submit();
            form.onerror = () => this.hideBlock();
            form.onsubmit = () => localStorage.removeItem('punchoutSessionId');
        } catch (error) {
            console.log("ERROR", error);
            alert((error as any).message);
            this.hideBlock();
        }
    }


    createPunchoutForm({ data, url }: { url: string, data: { [key: string]: string } }) {
        const form = document.createElement('form');
        form.setAttribute('hidden', 'true');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', url);
        Object.keys(data).forEach(key => {
            const input1 = document.createElement('input');
            input1.setAttribute('type', 'text');
            input1.setAttribute('name', key);
            input1.setAttribute('value', data[key]);
            form.appendChild(input1);
        });
        document.body.appendChild(form);
        return form;
    }


    showBlock() {
        this._block = this._block || this.createBlock();
        document.body.appendChild(this._block);
    }

    hideBlock() {
        this._block = this._block || this.createBlock();
        document.body.removeChild(this._block);
    }

    createBlock() {
        const block = document.createElement('div');
        block.classList.add('punchout-block');
        const loading = document.createElement('div');
        loading.classList.add('punchout-loading');
        loading.appendChild(document.createElement('div'));
        loading.appendChild(document.createElement('div'));
        block.appendChild(loading);
        return block;
    }

}

