#include<iostream>
#include <vector>

using namespace std;

vector<int> twoSum(vector<int> nums, int target) {
    int size = nums.size();
   
   for(int i=0; i<size;i++){
       for(int j= i+1; j<size; j++){
           if(nums[i]+ nums[j]== target){
               return {i,j};
           }
       }
   }
   
   return {-1,-1};
}

int main(){
    vector<int> nums= {1,2,3,4,5};
    int target= 3;

    vector<int> result = twoSum(nums,target);

    for(int num: result){
        cout << num;
    }

}