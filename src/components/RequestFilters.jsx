import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const RequestFilters = ({ onFilterChange, searchPlaceholder }) => {
  const handleStatusChange = (value) => {
    onFilterChange(prev => ({ ...prev, status: value }));
  };

  const handleSearchChange = (e) => {
    onFilterChange(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-4"
    >
      <Input
        placeholder={searchPlaceholder || "Search..."}
        onChange={handleSearchChange}
        className="glass-effect border-white/20 md:flex-1"
      />
      <Select onValueChange={handleStatusChange} defaultValue="all">
        <SelectTrigger className="w-full md:w-[180px] glass-effect border-white/20">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default RequestFilters;