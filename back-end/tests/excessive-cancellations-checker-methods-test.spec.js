import { ExcessiveCancellationsChecker } from "../excessive-cancellations-checker.js";
import fs from "fs";

const checker = new ExcessiveCancellationsChecker("./data/trades.csv");

describe("Excessive Cancellations Method Test", () => {
  describe("totalNumberOfWellBehavedCompanies", () => {
    it("generates the list of well behaved companies", async () => {
      const noOfWellBehavedCompanines =
        await checker.totalNumberOfWellBehavedCompanies();
      expect(noOfWellBehavedCompanines).toEqual(13);
    });
  });

  describe("loadAndGroupCsvData", () => {
    it("should read the CSV file", async () => {

      const filePath = `${__dirname}/test.csv`;
      const csvData = '2015-05-21 16:16:57,Bank of Mars,F,7'

      const expectedOutput = {
        "Bank of Mars": [
          {
            time: "2015-05-21 16:16:57",
            companyName: "Bank of Mars",
            orderType:  ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG,
            quantity: "7",
          },
        ]
      };

      fs.writeFileSync(filePath, csvData, "utf-8");

      const testChecker = new ExcessiveCancellationsChecker(filePath);
      const data = await testChecker.loadAndGroupCsvData();
      expect(data).toEqual(expectedOutput);

      fs.unlinkSync(filePath);
    });
  });

  describe("processOrderStatus", () => {
    it('should correctly update success when orderType is "D" or "F"', () => {
      const orderStatus = { success: 0, cancelled: 0 };
      const rowA = { orderType: ExcessiveCancellationsChecker.ORDER_FLAG , quantity: "10" };
      const rowB = { orderType: ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG, quantity: "10" };

      checker.processOrderStatus(rowA, orderStatus);

      expect(orderStatus.success).toBe(10);
      expect(orderStatus.cancelled).toBe(0);

      checker.processOrderStatus(rowB, orderStatus);
      expect(orderStatus.success).toBe(10);
      expect(orderStatus.cancelled).toBe(10);
    });

    it('should not update cancelled when orderType is not "D" or "F"', () => {
      const orderStatus = { success: 0, cancelled: 0 };
      const row = { orderType: "C", quantity: "5" };

      checker.processOrderStatus(row, orderStatus);

      expect(orderStatus.success).toBe(0);
      expect(orderStatus.cancelled).toBe(0);
    });
  });

  describe("ExcessiveCancellationsChecker ", () => {
    it("should return true when the time difference is less than the threshold (60 seconds)", () => {
      const currentRow = { time: "2024-11-22T10:00:00Z" };
      const nextRow = { time: "2024-11-22T10:00:30Z" }; // 10:00:30, 30 seconds later

      const result = checker.isTimeWithinThreshold(currentRow, nextRow);
      expect(result).toBe(true);
    });

    it("should return false when the time difference is more than the threshold (60 seconds)", () => {
      const currentRow = { time: "2024-11-22T10:00:00Z" }; // 10:00:00
      const nextRow = { time: "2024-11-22T10:02:30Z" }; // 10:02:30, 2 Mins and 30 seconds later

      const result = checker.isTimeWithinThreshold(currentRow, nextRow);
      expect(result).toBe(false);
    });
  });

  describe("exceedsOneThirdRatio ", () => {
    it("should return false when the cancellation to success ratio is less than 1/3", () => {
      const cancelled = 1;
      const success = 5;

      const result = checker.exceedsOneThirdRatio(cancelled, success);
      expect(result).toBe(false);
    });

    it("should return true when the cancellation to success ratio is more than 1/3", () => {
      const cancelled = 6;
      const success = 15;

      const result = checker.exceedsOneThirdRatio(cancelled, success);
      expect(result).toBe(true);
    });

    it("should return false when the cancellation to success ratio is exactly 1/3", () => {
      const cancelled = 3;
      const success = 9;

      const result = checker.exceedsOneThirdRatio(cancelled, success);
      expect(result).toBe(false);
    });
  });

  describe("groupOrdersByCompany ", () => {
    it("should group orders by company name", async () => {
      const orders = [
        {
          time: "2024-11-22T12:00:00",
          companyName: "Company A",
          orderType:  ExcessiveCancellationsChecker.ORDER_FLAG,
          quantity: 5,
        },
        {
          time: "2024-11-22T12:01:00",
          companyName: "Company A",
          orderType: ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG,
          quantity: 2,
        },
        {
          time: "2024-11-22T12:02:00",
          companyName: "Company B",
          orderType:  ExcessiveCancellationsChecker.ORDER_FLAG,
          quantity: 3,
        },
        {
          time: "2024-11-22T12:03:00",
          companyName: "Company B",
          orderType: ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG,
          quantity: 1,
        },
        {
          time: "2024-11-22T12:04:00",
          companyName: "Company C",
          orderType:  ExcessiveCancellationsChecker.ORDER_FLAG,
          quantity: 10,
        },
      ];

      const result = await checker.groupOrdersByCompany(orders);

      expect(result).toEqual({
        "Company A": [
          {
            time: "2024-11-22T12:00:00",
            companyName: "Company A",
            orderType: ExcessiveCancellationsChecker.ORDER_FLAG,
            quantity: 5,
          },
          {
            time: "2024-11-22T12:01:00",
            companyName: "Company A",
            orderType: ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG,
            quantity: 2,
          },
        ],
        "Company B": [
          {
            time: "2024-11-22T12:02:00",
            companyName: "Company B",
            orderType: ExcessiveCancellationsChecker.ORDER_FLAG,
            quantity: 3,
          },
          {
            time: "2024-11-22T12:03:00",
            companyName: "Company B",
            orderType: ExcessiveCancellationsChecker.CANCELLED_ORDER_FLAG,
            quantity: 1,
          },
        ],
        "Company C": [
          {
            time: "2024-11-22T12:04:00",
            companyName: "Company C",
            orderType:  ExcessiveCancellationsChecker.ORDER_FLAG,
            quantity: 10,
          },
        ],
      });
    });
  });
});
