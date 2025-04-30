/* eslint-disable */
export default async () => {
    const t = {
        ["./influencer/dto/create-influencer.dto"]: await import("./influencer/dto/create-influencer.dto"),
        ["./enums/index"]: await import("./enums/index")
    };
    return { "@nestjs/swagger": { "models": [[import("./influencer/dto/create-influencer.dto"), { "Account": { brandingLvl: { required: true, type: () => Number, maximum: 5, minimum: 1 }, followers: { required: true, type: () => Number }, username: { required: true, type: () => String }, platform: { required: true, enum: t["./enums/index"].Platform } }, "CreateInfluencerDto": { name: { required: true, type: () => String }, accounts: { required: true, type: () => [t["./influencer/dto/create-influencer.dto"].Account], minItems: 1 } } }]], "controllers": [[import("./influencer/influencer.controller"), { "InfluencerController": { "create": { type: Object } } }]] } };
};