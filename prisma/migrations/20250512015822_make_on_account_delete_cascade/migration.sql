-- DropForeignKey
ALTER TABLE "AccountNiche" DROP CONSTRAINT "AccountNiche_accountId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignAccount" DROP CONSTRAINT "CampaignAccount_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_campAcctId_fkey";

-- DropForeignKey
ALTER TABLE "Statistic" DROP CONSTRAINT "Statistic_contentId_fkey";

-- AddForeignKey
ALTER TABLE "AccountNiche" ADD CONSTRAINT "AccountNiche_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAccount" ADD CONSTRAINT "CampaignAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_campAcctId_fkey" FOREIGN KEY ("campAcctId") REFERENCES "CampaignAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
