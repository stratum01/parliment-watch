// Mock voting history for members

export const getMemberVotingHistory = (memberId) => {
  const votingHistory = {
    // Marco Mendicino
    "m1": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Nay",
        result: "Failed"
      },
      {
        bill: "C-45",
        description: "Cannabis Regulation Amendment Act",
        date: "2024-12-08",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Motion to proceed to Orders of the Day",
        date: "2024-12-05",
        vote: "Yea",
        result: "Failed"
      },
      {
        bill: "C-56",
        description: "Affordable Housing and Public Transit Act",
        date: "2024-11-20",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Confidence in the Prime Minister and the government)",
        date: "2024-11-15",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: "C-123",
        description: "Economic Statement Implementation Act",
        date: "2024-11-07",
        vote: "Yea",
        result: "Passed"
      }
    ],
    
    // Pierre Poilievre
    "m2": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Yea",
        result: "Failed"
      },
      {
        bill: "C-45",
        description: "Cannabis Regulation Amendment Act",
        date: "2024-12-08",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: null,
        description: "Motion to proceed to Orders of the Day",
        date: "2024-12-05",
        vote: "Nay",
        result: "Failed"
      },
      {
        bill: "C-56",
        description: "Affordable Housing and Public Transit Act",
        date: "2024-11-20",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Confidence in the Prime Minister and the government)",
        date: "2024-11-15",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: "C-123",
        description: "Economic Statement Implementation Act",
        date: "2024-11-07",
        vote: "Nay",
        result: "Passed"
      }
    ],
    
    // Jagmeet Singh
    "m3": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Yea",
        result: "Failed"
      },
      {
        bill: "C-45",
        description: "Cannabis Regulation Amendment Act",
        date: "2024-12-08",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Motion to proceed to Orders of the Day",
        date: "2024-12-05",
        vote: "Nay",
        result: "Failed"
      },
      {
        bill: "C-56",
        description: "Affordable Housing and Public Transit Act",
        date: "2024-11-20",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Confidence in the Prime Minister and the government)",
        date: "2024-11-15",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: "C-123",
        description: "Economic Statement Implementation Act",
        date: "2024-11-07",
        vote: "Yea",
        result: "Passed"
      }
    ],
    
    // Other members have similar patterns
    "m4": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Yea",
        result: "Failed"
      },
      {
        bill: "C-45",
        description: "Cannabis Regulation Amendment Act",
        date: "2024-12-08",
        vote: "Yea",
        result: "Passed"
      }
    ],
    "m5": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Nay",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Yea",
        result: "Failed"
      }
    ],
    "m6": [
      {
        bill: "C-79",
        description: "An Act for granting to His Majesty certain sums of money for the federal public administration",
        date: "2024-12-10",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Opposition Motion (Cost of living relief for Canadians)",
        date: "2024-12-09",
        vote: "Nay",
        result: "Failed"
      },
      {
        bill: "C-45",
        description: "Cannabis Regulation Amendment Act",
        date: "2024-12-08",
        vote: "Yea",
        result: "Passed"
      },
      {
        bill: null,
        description: "Motion to proceed to Orders of the Day",
        date: "2024-12-05",
        vote: "Yea",
        result: "Failed"
      },
      {
        bill: "C-56",
        description: "Affordable Housing and Public Transit Act",
        date: "2024-11-20",
        vote: "Yea",
        result: "Passed"
      }
    ]
  };
  
  return votingHistory[memberId] || [];
};