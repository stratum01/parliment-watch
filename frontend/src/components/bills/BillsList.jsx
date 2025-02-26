import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BillCard from './BillCard';
import { useBills } from '@/hooks/useBills';

const BillsList = () => {
  const { bills, loading, error } = useBills();

  if (loading) return <div>Loading bills...</div>;
  if (error) return <div>Error loading bills: {error}</div>;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Active Bills</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {bills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { BillStatusOverview, BillCard, BillsList };