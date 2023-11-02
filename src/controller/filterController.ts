import axios from "axios";
import { getCamundaApiUrl, getCamundaCredentials } from "../common";
import { Request, Response } from 'express';




export const getFilter = async (req: Request, res: Response) => {
    try {
        // Define the URL to retrieve filter data
        const camundaApiUrl = getCamundaApiUrl();
        const { username, password } = getCamundaCredentials();

        // Retrieve the filter name from the query parameter
        const filterName: string | undefined = req.query.filterName as string | undefined;

        if (!filterName) {
            return res.status(400).json({ error: "Filter name is missing in the query parameters" });
        }

        // URL for retrieving filter data with the given filter name
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
        const filterUrl = `${camundaApiUrl}/filter?name=${encodeURIComponent(filterName)}`;

        // Make an HTTP GET request to retrieve filter data
        const response = await axios.get(filterUrl, {
            headers: {
                Authorization: authHeader,
                Accept: "application/json", // Set the Accept header
            },
        });

        if (response.status === 200) {
            // Handle the response as needed
            const responseData = {
                filterName,
                filterData: response.data,
            };
            return res.status(200).json(responseData);
        } else {
            throw new Error(`Failed to retrieve filter data. Camunda response: ${response.status}`);
        }
    } catch (error: any) {
        console.error("Error retrieving filter data:", error.message);
        res.status(500).json({ error: "Failed to retrieve filter data" });
    }
};


