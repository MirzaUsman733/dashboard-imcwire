"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

function PricingTab(props) {
  return (
    <div className={`h-full ${props.popular ? "dark" : ""}`}>
      <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 shadow shadow-slate-950/5">
        {props.popular && (
          <div className="absolute top-0 right-0 mr-6 -mt-4">
            <div className="inline-flex items-center text-xs font-semibold py-1.5 px-3 bg-emerald-500 text-white rounded-full shadow-sm shadow-slate-950/5">
              Most Popular
            </div>
          </div>
        )}
        <div className="mb-5">
          <div className="flex justify-between">
            <div className="text-slate-900 dark:text-slate-200 font-semibold mb-1">
              {props.planName}
            </div>
            <div className="font-bold text-sm">
              Total Prize: ${props.totalPlanPrice}
            </div>
          </div>
          <div className="inline-flex items-baseline mb-2">
            <span className="text-slate-900 dark:text-slate-200 font-bold text-3xl">
              $
            </span>
            <span className="text-slate-900 dark:text-slate-200 font-bold text-4xl">
              {props.price}
            </span>
            <span className="text-slate-500 font-medium">/pr</span>
          </div>
          <div className="line-through text-red text-lg decoration-red">
            $650
          </div>

          <div>On Buying {props.priceSingle}</div>
          <div className="text-sm text-slate-500 mb-5">
            {props.planDescription}
          </div>
          <Link
            href="/create"
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150"
            passHref
          >
            Purchase Plan
          </Link>
          {props.pdfLink && (
            <Link
              className="block mt-2 text-sm text-indigo-500 hover:underline"
              href={props.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              PR Report Sheet pdf
            </Link>
          )}
        </div>
        <div
          className="custom-scrollbar"
          style={{ maxHeight: "500px", overflowY: "scroll" }}
        >
          <div className="text-slate-900 dark:text-slate-200 font-medium mb-3 mt-2">
            MEDIA DISTRIBUTION
          </div>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-3 grow">
            {props.features.map((feature, index) => {
              return (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-3 h-3 fill-emerald-500 mr-3 shrink-0"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                  </svg>
                  <span>{feature}</span>
                </li>
              );
            })}
          </ul>
          <div className="text-slate-900 dark:text-slate-200 font-medium mb-3 mt-5">
            TOP TIER NEWSWIRE
          </div>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-3 grow">
            {props.medias.map((media, index) => {
              return (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-3 h-3 fill-emerald-500 mr-3 shrink-0"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                  </svg>
                  <span>{media}</span>
                </li>
              );
            })}
          </ul>

          <div className="text-slate-900 dark:text-slate-200 font-medium mb-3 mt-5">
            FEATURES
          </div>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-3 pb-5 grow">
            {props.topTier.map((tier, index) => {
              return (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-3 h-3 fill-emerald-500 mr-3 shrink-0"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                  </svg>
                  <span>{tier}</span>
                  <div className="hidden">
                    <Link href="https://imcwire.com/">
                      Genuine Media Coverage
                    </Link>
                    <Link href="https://imcwire.com/">press releases</Link>
                    <Link href="https://imcwire.com/">PR Network</Link>
                    <Link href="https://imcwire.com/">PR Services</Link>
                    <Link href="https://imcwire.com/">
                      Press Release Distribution Services
                    </Link>
                    <Link href="https://imcwire.com/">
                      Press Release Syndication
                    </Link>
                    <Link href="https://imcwire.com/">NewsWire</Link>
                    <Link href="https://imcwire.com/">NewsWire Services</Link>
                    <Link href="https://imcwire.com/">
                      Guaranteed Publishing
                    </Link>
                    <Link href="https://imcwire.com/">PR Agency Packages</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

const PricingPlan = () => {
  return (
    <div className="mt-24">
      <h2 className="text-purple-900 font-bold text-center text-3xl mb-14">
        Get your News out to the World with a Professional Press Release
        Package, Valid for One Year from Purchase.
      </h2>
      <div className="max-w-sm mx-auto grid gap-6 lg:grid-cols-3 items-start lg:max-w-none mb-20">
        <PricingTab
          planName="Essential"
          totalPlanPrice={650}
          price={650}
          priceSingle="Single PR Price"
          planDescription="Guaranteed News Distribution with Media Coverage"
          features={[
            "350+ Guaranteed Placements",
            "Guaranteed Press Release Reach",
            "Google Inclusion",
            "Yahoo Inclusion",
            "Bing Inclusion",
            "Google News Inclusion",
            "Apple News Inclusion",
          ]}
          medias={[
            "Premium News Network",
            "Featured On USA TV and Radio distribution network",
            "Featured On FOX",
            "Featured On CW",
            "Google News Network",
            "Guaranteed Financial Distribution",

            "Guaranteed Marketmedia Distribution",
          ]}
          topTier={[
            " Yahoo Finance",
            "Bloomberg",
            " MarketWatch",
            "Benzinga",
            "CanadianInsider",
            "InsiderTracking",
            "Digital Journal",
            "StreetInsider",
            "Dow Jones",
            "Apple News",
            "340+ More News and media outlets",
          ]}
          pdfLink="https://imcwire.com/estoozot/2024/01/IMCWire-Premimum-Media-Coverage-Package.pdf"
        />

        {/* Pricing tab 2 */}
        <PricingTab
          popular={true}
          planName="Perform"
          totalPlanPrice={3300}
          priceSingle="6 PR Price"
          price={550}
          planDescription="Guaranteed News Distribution with Media Coverage
"
          features={[
            "350+ Guaranteed Placements",
            "Guaranteed Press Release Reach",
            "Google Inclusion",
            "Yahoo Inclusion",
            "Bing Inclusion",
            "Google News Inclusion",
            "Apple News Inclusion",
          ]}
          medias={[
            "Premium News Network",
            "Featured On USA TV and Radio distribution network",
            "Featured On FOX",
            "Featured On CW",
            "Google News Network",
            "Guaranteed Financial Distribution",
            "Guaranteed Marketmedia Distribution",
          ]}
          topTier={[
            " Yahoo Finance",
            "Bloomberg",
            " MarketWatch",
            "Benzinga",
            "CanadianInsider",
            "InsiderTracking",
            "Digital Journal",
            "StreetInsider",
            "Dow Jones",
            "Apple News",
            "340+ More News and media outlets",
          ]}
          pdfLink="https://imcwire.com/estoozot/2024/01/IMCWire-Premimum-Media-Coverage-Package.pdf"
        />

        {/* Pricing tab 3 */}
        <PricingTab
          planName="Enterprise"
          price={400}
          totalPlanPrice={4800}
          priceSingle="12 PR Price"
          planDescription="Guaranteed News Distribution with Media Coverage
"
          features={[
            "350+ Guaranteed Placements",
            "Guaranteed Press Release Reach",
            "Google Inclusion",
            "Yahoo Inclusion",
            "Bing Inclusion",
            "Google News Inclusion",
            "Apple News Inclusion",
          ]}
          medias={[
            "Premium News Network",
            "Featured On USA TV and Radio distribution network",
            "Featured On FOX",
            "Featured On CW",
            "Google News Network",
            "Guaranteed Financial Distribution",
            "Guaranteed Marketmedia Distribution",
          ]}
          topTier={[
            " Yahoo Finance",
            "Bloomberg",
            " MarketWatch",
            "Benzinga",
            "CanadianInsider",
            "InsiderTracking",
            "Digital Journal",
            "StreetInsider",
            "Dow Jones",
            "Apple News",
            "340+ More News and media outlets",
          ]}
          pdfLink="https://imcwire.com/estoozot/2024/01/IMCWire-Premimum-Media-Coverage-Package.pdf"
        />
      </div>
    </div>
  );
};
export default PricingPlan;
