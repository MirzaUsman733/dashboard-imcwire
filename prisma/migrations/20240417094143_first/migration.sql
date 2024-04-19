-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "resetToken" TEXT,
    "tokenExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "loggedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "status" TEXT,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compaignData" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "formDataSignUp" JSONB,
    "matchedPlanData" JSONB,
    "selectedCategories" JSONB,
    "selectedCountries" JSONB,
    "selectedCountryTranslations" JSONB,
    "selectedPrice" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "categorySubtotal" DOUBLE PRECISION,
    "countrySubTotal" DOUBLE PRECISION,
    "countryTranslationsPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "selectedOption" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "action" TEXT NOT NULL DEFAULT 'pending',
    "isAgency" BOOLEAN,
    "agencyName" TEXT,
    "transactionId" TEXT,
    "currentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compaignData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" SERIAL NOT NULL,
    "eventType" JSONB NOT NULL,
    "eventData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" SERIAL NOT NULL,
    "planName" TEXT NOT NULL,
    "priceSingle" DOUBLE PRECISION NOT NULL,
    "totalPlanPrice" DOUBLE PRECISION NOT NULL,
    "numberOfPR" INTEGER NOT NULL DEFAULT 0,
    "planDescription" TEXT NOT NULL,
    "pdfLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "storeData" JSONB NOT NULL,
    "formData" JSONB NOT NULL,
    "formDataContract" JSONB NOT NULL,
    "pressReleaseTitle" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "user" JSONB,
    "currentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" SERIAL NOT NULL,
    "storeData" JSONB NOT NULL,
    "formData" JSONB NOT NULL,
    "formDataContract" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "pdf" TEXT,
    "excel" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "couponCode" TEXT,
    "discountPercentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "compaignData_clientId_key" ON "compaignData"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "Coupon"("couponCode");

-- AddForeignKey
ALTER TABLE "LoginLog" ADD CONSTRAINT "LoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
