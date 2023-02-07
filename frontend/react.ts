import { CartResponse, NaiveCart, PunchoutCartService, PunchoutLoginResponse, punchoutLogin } from './common';

// Route: "/punchout/:id" (GET) handler
// REACT function component
function Punchout({ id }: { id: string }) {

    const [error, setError] = useState('');

    useEffect(() => {
        api.punchoutLogin(id)
            .then(res => {
                // TODO:
                // set user as logged in
                /// save punchout id somewhere `res.punchoutId` 
                // redirect to homepage 
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    // you can show the error or even hide it, but it is good to have it at least initially for debugging
    return html`${error}`;
}



// TODO: On the checkout page, where the checkout button is shown there is should be an if statement

/*
    if (punchoutId) {
        // show the punchout button
        <button onclick=${()=>onPunchoutClick()} type="button" class="action primary checkout">
    } else {
        show regular checkout button
    }


*/


const getCart = (): NaiveCart => {
    // TODO: get cart from redux or whatever
    return {} as any;
};

const onPunchoutClick = () => {
    punchout.submitCart(getCart())
        .then(() => { });
};



const punchout = new PunchoutCartService();