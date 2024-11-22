import fs from 'fs'
import csv from 'csv-parser'

// Note : For production code console.log will be replaced with monitoring tools
export class ExcessiveCancellationsChecker {

    static ORDER_FLAG = 'D'
    static CANCELLED_ORDER_FLAG = 'F'

    /* 
        We provide a path to a file when initiating the class
        you have to use it in your methods to solve the task
    */
    constructor(filePath) {
        this.filePath = filePath;
        this.parsedData = null;
    }

    /**
     * Identifies companies that are involved in excessive cancellations.
     * 
     * Excessive cancellations occur if, within any 60-second period for a given company,
     * the ratio of the cumulative quantity of cancels to the total cumulative quantity of orders exceeds 1/3.
     * 
     * @returns {Promise<string[]>} Resolves to an array of company names engaged in excessive cancellations.
     */
    async companiesInvolvedInExcessiveCancellations() {
        try {
            const companiesOrderData = await this.getParsedData()
            const excessiveCancellationCompanies = [];
            for (const companyName in companiesOrderData) {

                const companyOrderRecord = companiesOrderData[companyName]
                let orderStats = { success: 0, cancelled: 0 };

                for (let i = 0; i < companyOrderRecord.length; i++) {

                    const currentRow = companyOrderRecord[i];
                    const nextRow = companyOrderRecord[i + 1];

                    if (!nextRow || !this.isTimeWithinThreshold(currentRow, nextRow)) continue;

                    this.processOrderStatus(currentRow, orderStats)
                    this.processOrderStatus(nextRow, orderStats)

                    if (this.exceedsOneThirdRatio(orderStats.cancelled, orderStats.success)) {
                        excessiveCancellationCompanies.push(companyName)
                        break;
                    }
                }
            }
            return excessiveCancellationCompanies
        } catch (error) {
            console.error(error.message)
            return []; // 
        }
    }

    /**
     * Returns the total number of companies that are not involved in any excessive cancelling.
     * Note this should always resolve a number or throw error.
    */
    async totalNumberOfWellBehavedCompanies() {

        let wellBehavedCompanies = 0;
        const excessiveCancellationCompanies = await this.companiesInvolvedInExcessiveCancellations();
        const companiesOrderData = this.parsedData;

        for (const companyName in companiesOrderData) {
            if (!excessiveCancellationCompanies.includes(companyName)) wellBehavedCompanies++
        }

        return wellBehavedCompanies;
    }

    /**
     * Reads a CSV file, parses its content, and groups the data by `companyName`.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object where keys are company names,
     *                            and values are arrays of order records for each company.
     */
    async loadAndGroupCsvData() {
        const results = [];
        const headers = ['time', 'companyName', 'orderType', 'quantity']
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.filePath)
                .pipe(csv(headers))
                .on('data', (data) => {
                    results.push(data)
                })
                .on('end', () => {
                    const groupedData = this.groupOrdersByCompany(results)
                    resolve(groupedData);
                    console.log('File Parsing Completed')
                })
                .on('error', (error) => {
                    reject(new Error('Failed to parse CSV data'));
                });
        })
    }

    /**
     * Loads and parses the CSV file only once and caches the result.
     * If called multiple times, it reuses the cached data.
     * 
     * @returns {Promise<Object>} Grouped data by company name.
     */
    async getParsedData() {
        if (!this.parsedData) {
            this.parsedData = await this.loadAndGroupCsvData();
        }
        return this.parsedData;
    }
    /**
     * Groups an array of objects by the `companyName` property.
     * 
     * @param {Object[]} array - Array of objects to group. Each object must have a `companyName` property.
     * @returns {Object} An object where keys are company names, and values are arrays of objects for each company.
     */
    async groupOrdersByCompany(array) {
        return array.reduce((result, currentValue) => {
            const groupKey = currentValue.companyName;
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(currentValue);

            return result;
        }, {});
    }

    /**
     * Checks if the ratio of cancellations to total orders is greater than 1/3.
     * 
     * @param {number} cancelled - The cumulative quantity of cancellations.
     * @param {number} success - The cumulative quantity of successful orders.
     * @returns {boolean} Returns true if the ratio is greater 1/3; otherwise false.
     */
    exceedsOneThirdRatio(cancelled, success) {
        return cancelled / success > 1 / 3
    }

    /**
 * Checks if the time difference between two orders is within the specified threshold.
 * 
 * @param {Object} currentRow - The current order.
 * @param {Object} nextRow - The next order.
 * @returns {boolean} True if the time difference between the two orders is within the threshold, otherwise false.
 */
    isTimeWithinThreshold(currentRow, nextRow) {
        const timeThreshold = 60 * 1000; // 60 seconds
        const currentRecordTime = new Date(currentRow?.time).getTime();
        const nextRecordTime = new Date(nextRow?.time).getTime();
        return (nextRecordTime - currentRecordTime) <= timeThreshold;
    }

    /**
     * Update the success and cancelled status counter
     * @param {Object} row 
     * @param {Object} orderStatus 
     */
    processOrderStatus(row, orderStatus) {

        if (row.orderType === ExcessiveCancellationsChecker.ORDER_FLAG) {
            orderStatus.success += Number(row.quantity)
        } else if (row.orderType === ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG) {
            orderStatus.cancelled += Number(row.quantity)
        }
    }

}
