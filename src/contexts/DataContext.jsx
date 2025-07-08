import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [distributorLimits, setDistributorLimits] = useState({});

  useEffect(() => {
    const savedRequests = localStorage.getItem('incentiveRequests');
    const savedUsers = localStorage.getItem('systemUsers');
    const savedLimits = localStorage.getItem('distributorLimits');

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const demoUsers = [
        { id: 1, name: 'John Fabricator', email: 'john@fab.com', role: 'fabricator', phone: '+1234567890', points: 0 },
        { id: 2, name: 'Sarah Dealer', email: 'sarah@dealer.com', role: 'dealer', phone: '+1234567891', distributorId: 3 },
        { id: 3, name: 'Mike Distributor', email: 'mike@dist.com', role: 'distributor', phone: '+1987654321' },
        { id: 4, name: 'Admin Company', email: 'admin@company.com', role: 'company', phone: '+1234567893' }
      ];
      setUsers(demoUsers);
      localStorage.setItem('systemUsers', JSON.stringify(demoUsers));
    }

    if (savedLimits) {
      setDistributorLimits(JSON.parse(savedLimits));
    } else {
      const demoLimits = {
        3: { totalLimit: 10000, usedLimit: 2500 }
      };
      setDistributorLimits(demoLimits);
      localStorage.setItem('distributorLimits', JSON.stringify(demoLimits));
    }
  }, []);

  const saveRequests = (newRequests) => {
    setRequests(newRequests);
    localStorage.setItem('incentiveRequests', JSON.stringify(newRequests));
  };

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('systemUsers', JSON.stringify(newUsers));
  };

  const saveDistributorLimits = (newLimits) => {
    setDistributorLimits(newLimits);
    localStorage.setItem('distributorLimits', JSON.stringify(newLimits));
  };

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending_dealer',
      dealerApproval: null,
      distributorApproval: null,
      companyApproval: null,
      points: 0
    };
    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);
  };

  const updateRequest = (requestId, updates) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, ...updates } : req
    );
    saveRequests(updatedRequests);
  };

  const updateDistributorLimit = (distributorId, usedAmount) => {
    const updatedLimits = {
      ...distributorLimits,
      [distributorId]: {
        ...distributorLimits[distributorId],
        usedLimit: (distributorLimits[distributorId]?.usedLimit || 0) + usedAmount
      }
    };
    saveDistributorLimits(updatedLimits);
  };

  const setDistributorLimit = (distributorId, newTotalLimit) => {
    const updatedLimits = {
      ...distributorLimits,
      [distributorId]: {
        ...distributorLimits[distributorId],
        totalLimit: newTotalLimit
      }
    };
    saveDistributorLimits(updatedLimits);
  };

  const updateUserPoints = (userId, pointsChange) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, points: (u.points || 0) + pointsChange } : u
    );
    saveUsers(updatedUsers);
  };

  const assignDistributorToDealer = (dealerId, distributorId) => {
    const updatedUsers = users.map(u => 
      u.id === dealerId ? { ...u, distributorId: distributorId } : u
    );
    saveUsers(updatedUsers);
  };

  const value = {
    requests,
    users,
    distributorLimits,
    addRequest,
    updateRequest,
    updateDistributorLimit,
    setDistributorLimit,
    saveUsers,
    saveDistributorLimits,
    updateUserPoints,
    assignDistributorToDealer
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};