import java.util.*;

public class BankConsoleApp {

    static HashMap<String, String> map = new HashMap<>();

    static {
        map.put("admin", "admin123");
        map.put("customer1", "password123");
        map.put("customer2", "password123");
        map.put("customer3", "password123");
    }

    public static void main(String[] args) {
        Bank b1 = new Bank(1, "ABC World Bank");
        Bank b2 = new Bank(2, "123 National Bank");

        String currentUsername = login();

        if (currentUsername.equals("")){
            System.out.print("Login Failed");
        }
        else{
            System.out.printf("Logged in user %s", currentUsername);
        }

    }
    
    public static String login() {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter your username: ");
        String username = scanner.nextLine();

        System.out.print("Enter your password: ");
        String password = scanner.nextLine();

        scanner.close();

        if (validate_login(username, password)) {
            return username;
        } else {
            return "";
        }
    }
    
    public static boolean validate_login(String username, String password) {
        if (!map.containsKey(username)) {
            return false;
        }
        else {
            return map.get(username).equals(password);
        }
    }

    /*
        Bank Class
    */

    static class Bank {
        // Fields
        private int id;
        private String name;

        // Constructor
        public Bank(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() {
            return this.id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return this.name;
        }

        public void setId(String name) {
            this.name = name;
        }
    }

    /*
        User Interface with Admin or Customer
    */

    abstract static class User {
        private int userId;
        private String username;
        private String password;
        private int bankId;

        public User(int userId, String username, String password, int bankId) {
            this.userId = userId;
            this.username = username;
            this.password = password;
            this.bankId = bankId;
        }

        abstract boolean getRole();

        public String getUsername() {
            return this.username;
        }

        public String getPassword() {
            return this.password;
        }
    }

    static class Admin extends User {
        private boolean role;

        public Admin(int userId, String username, String password, int bankId) {
            super(userId, username, password, bankId);
            this.role = true;
        }

        @Override
        public boolean getRole() {
            return this.role;
        }

    }
    
    static class Customer extends User {
        private boolean role;

        public Customer(int userId, String username, String password, int bankId) {
            super(userId, username, password, bankId);  
            this.role = false;
        }

        @Override
        public boolean getRole() {
            return this.role;
        }

    }


}
