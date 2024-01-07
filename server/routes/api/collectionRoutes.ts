
// import { Admin, Collection, User } from '../../models'
import express, { Request, Response } from "express";
import { CC } from '../../controllers';
const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const { status, response } = await CC.getAll();
    res.status(status).send(response);
})

// router.get("/owner/:wallet", async (req:Request, res:Response) => {
//     const { wallet } = req.params;
//     const { status, response } = await CC.getByOwner(wallet);
//     res.status(status).send(response);
// })


/**
 * Creates a new collection
 * @param {object} req.body the data to create the collection with
 * @param {string} req.body.collection the name of the collection
 * @param {string} req.body.manager the wallet address of the collection manager
 * @param {string} req.body.pda the PDA of the collection
 * @param {string} req.body.reward_wallet the wallet address to send rewards to
 * @param {string} req.body.vca the verification code for the collection
 * @returns {object} an object containing the status and response
 */
router.post("/new",
    async (req: Request, res: Response) => {
        try {
            const { collection, manager, pda, reward_wallet, vca } = req.body;
            const { status, response } = await CC.create({ ...req.body })
            res.status(status).send(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    })

/**
 * Updates an existing collection
 * @param {string} pda the PDA of the collection to update
 * @param {string} wallet the wallet address of the collection owner
 * @param {object} data the data to update the collection with
 * @returns {object} an object containing the status and response
 */
async (req: Request, res: Response) => {
    try {
        console.log('update')
        const { pda, wallet, data } = req.body
        const { status, response } = await CC.updateCollection(pda, wallet, data);
        res.status(status).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);

    }
}
/**
 * Updates an existing collection
 * @param {string} pda the PDA of the collection to update
 * @param {string} wallet the wallet address of the collection owner
 * @param {object} data the data to update the collection with
 * @returns {object} an object containing the status and response
 */
router.post('/update',
    async (req: Request, res: Response) => {
        try {
            console.log('update')
            const { pda, wallet, data } = req.body
            const { status, response } = await CC.updateCollection(pda, wallet, data);
            res.status(status).send(response);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);

        }
    })

/**
 * Adds a new style to an existing collection
 * @param {string} pda the PDA of the collection
 * @param {string} wallet the wallet address of the collection owner
 * @param {string} style the style to add
 * @returns {object} an object containing the status and response
 */
router.post('/style/add',
    async (req: Request, res: Response) => {
        console.log('Adding Style')
        const { wallet, pda, style } = req.body;
        const { status, response } = await CC.addStyle(pda, wallet, style);
        res.status(status).send(response);

    })

/**
 * Gets the hashlist of a collection
 * @param {string} pda the PDA of the collection
 * @returns {object} an object containing the status and response
 */
router.get('/hashlist/:pda',
    async (req: Request, res: Response) => {
        const { pda } = req.params;
        console.log(pda);
        const { status, response } = await CC.getHashlist(pda);
        res.status(status).send(response);
    })
/**
 * Adds a new hashlist to an existing collection
 * @param {string} wallet the wallet address of the collection owner
 * @param {string} name the name of the hashlist
 * @param {string[]} hashlist the list of NFT metadata hashes
 * @param {string} pda the PDA of the collection
 * @returns {object} an object containing the status and response
 */
router.post('/hashlist/add',
    async (req: Request, res: Response) => {
        const { hashlist, wallet, name, pda } = req.body;
        const { status, response } = await CC.addHashlist(wallet, name, hashlist, pda)
        res.status(status).send(response);
    })

/**
 * Gets information about a collection
 * @param {string} pda the PDA of the collection
 * @returns {object} an object containing the status and response
 */
router.get('/info/:pda',
    async (req: Request, res: Response) => {
        const { pda } = req.params;
        console.log(`Getting Info for ${pda}`)
        const { status, response } = await CC.getByPDA(pda)
        // console.log({ response })
        res.status(status).json(response)
    })

/**
* Deletes a collection by its PDA
* @param {string} pda the PDA of the collection to delete
* @returns {object} an object containing the status and response
*/
router.delete("/:pda", async (req: Request, res: Response) => {
    const { status, response } = await CC.deleteByPDA(req.params.pda)
    res.status(status).send(response);
})

/**
* Handles requests with an unsupported method.
* @param {express.Request} req the request object
* @param {express.Response} res the response object
*/
router.use((req, res
) => {
    res.status(404).end();
});

export default router;