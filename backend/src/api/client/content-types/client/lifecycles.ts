
export default {
    async beforeCreate(event) {
        const { data, where, select, populate } = event.params;

        if (data.logo) {
            // Logic to fetch image URL is tricky in beforeCreate because the relation might not be fully resolved or requires a separate fetch.
            // However, usually 'data.logo' is just an ID in the payload.
            // We might need 'afterCreate' or 'beforeUpdate'.
            // For simplicity and safety, let's look up the file if an ID is provided.
            try {
                const fileId = data.logo;
                if (fileId) {
                    const file = await strapi.documents('plugin::upload.file').findOne({ documentId: fileId });
                    if (file && file.url) {
                        data.logoUrl = file.url;
                    }
                }
            } catch (e) {
                console.error("Error syncing logoUrl in beforeCreate:", e);
            }
        }
    },

    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        if (data.logo) {
            try {
                // data.logo could be an ID or an object depending on the API call structure.
                // In Admin Panel updates, it's usually an ID (or disconnect/connect object).
                // Let's inspect what we get. If it's an ID, fetch it.
                const fileId = data.logo;
                // Note: In some contexts (v5), creating/updating relations might be different. 
                // If 'logo' is being updated, we try to find the file.

                // Strapi v5 Document Service might pass documentId.
                if (typeof fileId === 'string') {
                    const file = await strapi.documents('plugin::upload.file').findOne({ documentId: fileId });
                    if (file && file.url) {
                        data.logoUrl = file.url;
                    }
                }
            } catch (e) {
                console.error("Error syncing logoUrl in beforeUpdate:", e);
            }
        }
    },
};
