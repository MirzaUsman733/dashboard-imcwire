import React from 'react';

const Page = () => {
  return (
    <div className="mx-auto mt-44 rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl p-0" data-v0-t="card">
      <div className="p-0">
        <div className="grid gap-4 p-6">
          <div className="flex items-center">
            <img
              src="../favicon.ico"
              width="60"
              height="48"
            //   className="rounded-md"
              alt="Logo"
            //   style={{ aspectRatio: '48 / 48', objectFit: 'cover' }}
            />
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Receipt
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">#3102</div>
            </div>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-gray-100 h-[1px] w-full border-gray-200 dark:border-gray-800"
          ></div>
          <div className="grid gap-1 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Acme Inc</div>
              <div className="text-right">Customer</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>123 Main St</div>
              <div className="text-right">Sophia Anderson</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>Anytown, CA, 12345</div>
              <div className="text-right">sophia@example.com</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>United States</div>
              <div className="text-right">+1 888 8888 8888</div>
            </div>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-gray-100 h-[1px] w-full border-gray-200 dark:border-gray-800"
          ></div>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Payment method</div>
              <div className="text-right">Bank transfer</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Date</div>
              <div className="text-right">June 23, 2022</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Transaction ID</div>
              <div className="text-right">#3102</div>
            </div>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-gray-100 h-[1px] w-full border-gray-200 dark:border-gray-800"
          ></div>
          <div className="grid gap-4">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <tbody className="[&amp;_tr:last-child]:border-0">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">Subscription</td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$169.00</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">Tax</td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$19.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center font-medium">
              <div>Total</div>
              <div className="ml-auto">$150.00</div>
            </div>
          </div>
          <div
            data-orientation="horizontal"
            role="none"
            className="shrink-0 bg-gray-100 h-[1px] w-full border-gray-200 dark:border-gray-800"
          ></div>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Amount</div>
              <div className="text-right">$150.00</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium">Status</div>
              <div className="text-right text-green-500">Paid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
