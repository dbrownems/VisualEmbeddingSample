# VisualEmbeddingSample
Sample of embedding PBI visuals from multiple workspaces

This sample is a User-Owns-Data Power BI Emedded application that embeds individusl visuals from multiple workspaces.  Each visual is embedded seperately, and so if you embed many visuals, the load time will increase.

To run the sample you'll need to register a App Registration in AAD, and configure the project with the ClientId and ClientSecret.

The main page is /EmbedVisuals/Embed, and there's a configuration page at /EmbedInfo/Embed that you can use to browse available reports and select visuals for embedding.

The visuals to embed are configured in the visuals.json file, which is consumed by client-side javascript to actually do the embedding.
