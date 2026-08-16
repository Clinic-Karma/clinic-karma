import { getSpecializations } from '../src/db_utils/doctor.js';
import { getAllBranchManagers } from '../src/db_utils/branchmanager.js';
import {
  getAllTopManagers,
  getRevenueTrends,
  getPendingPayments,
} from '../src/db_utils/topmanager.js';
import { sql } from '../src/db_utils/db.js';

const [
  specializations,
  branchManagers,
  topManagers,
  revenue,
  pendingPayments,
  appointmentDetails,
  billingSummary,
] = await Promise.all([
  getSpecializations(),
  getAllBranchManagers(),
  getAllTopManagers(),
  getRevenueTrends(),
  getPendingPayments(),
  sql.query('SELECT * FROM appointment_details LIMIT 5'),
  sql.query('SELECT * FROM billing_summary LIMIT 5'),
]);

console.log(JSON.stringify({
  connected: true,
  readModels: {
    specializations: specializations.length,
    branchManagers: branchManagers.length,
    topManagers: topManagers.length,
    revenuePeriods: revenue.length,
    pendingPayments: pendingPayments.length,
    appointmentDetails: appointmentDetails.length,
    billingSummaries: billingSummary.length,
  },
}, null, 2));
