#include<iostream>
#include<string>
#include<vector>

using namespace std;

// a password is strong if it contains atleast 1 uppercase letter, 1 lower case letter, 1 number, 1 special character and also is not part of some special keywords or only conatains space
bool strongPassword(string password, vector<string> banned){
    bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;

    for (char c : password) {
        if (isupper(c)) hasUpper = true;
        else if (islower(c)) hasLower = true;
        else if (isdigit(c)) hasDigit = true;
        else if (ispunct(c)) hasSpecial = true;
    }

    if (!(hasUpper && hasLower && hasDigit && hasSpecial)) {
        return false;
    }


    for (string word : banned) {
        if (password.find(word) != string::npos) {
            return false;
        }
    }

    return true;
}

int main(){

    string pass= "HelloWorld0.07";
    vector<string> banned={"password", "admin", "qwerty", "123456"};

    cout << boolalpha << strongPassword(pass,banned);

}