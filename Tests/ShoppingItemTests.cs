using ShopBuddy.Models;

namespace ShopBuddy.TestRunner
{
    public class SimpleShoppingItemTests
    {
        public bool TestShoppingItemCreation()
        {
            // Test basic model functionality
            var item = new ShoppingItem
            {
                Name = "Test Item"
            };

            return item.Name == "Test Item" && 
                   !item.IsCompleted && 
                   item.CreatedAt <= DateTime.UtcNow;
        }

        public bool TestShoppingItemCompletion()
        {
            var item = new ShoppingItem
            {
                Name = "Test Item",
                IsCompleted = false
            };

            item.IsCompleted = true;

            return item.IsCompleted;
        }

        public static void RunAllTests()
        {
            var tests = new SimpleShoppingItemTests();
            
            Console.WriteLine("Running ShopBuddy Tests...");
            
            bool test1 = tests.TestShoppingItemCreation();
            Console.WriteLine($"Test 1 - Shopping Item Creation: {(test1 ? "PASSED" : "FAILED")}");
            
            bool test2 = tests.TestShoppingItemCompletion();
            Console.WriteLine($"Test 2 - Shopping Item Completion: {(test2 ? "PASSED" : "FAILED")}");
            
            if (test1 && test2)
            {
                Console.WriteLine("All tests PASSED!");
            }
            else
            {
                Console.WriteLine("Some tests FAILED!");
                Environment.Exit(1);
            }
        }
    }
}
