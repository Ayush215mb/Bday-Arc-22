#include <iostream>
#include<string> 
#include<map>
using namespace std;

// check if two string are anagrams(have same letters)
bool isAnagram(string s, string t){
    if(s.length()!= t.length()){
        return false;
    }

    map<char,int> letters;

    for(char c:s){
        letters[c]++;
    }

    for( char c:t){
        if(letters.find(c)== letters.end() || letters[c]==0){
            return false;
        }
        letters[c]--;
    }

    return true;
}


int main(){
    string one = "hello", two = "helol";

    cout << isAnagram(one,two);

}