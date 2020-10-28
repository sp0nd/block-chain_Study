#include <iostream>
#include<string>
#include<vector>
#include<time.h>
#include "sha256.h"
using namespace std;
//int main()
//{
////cout << sha256("\n") << endl;
////cout << sha256("\n\n") << endl;
////cout << sha256("\n");
//    int i = 0;
//    string hash;
//    cout << "text hashing :"<< sha256("docker Kill") << endl;
//    while (1)
//    {
//               
//        hash = sha256(sha256("docker Kill")+to_string(i));
//        printf("%100d:%s\r", i, hash.c_str());
//        if (hash.substr(0,4)=="0000")
//        {
//            cout<< hash;
//            break;
//        }
//        i++;
//    }
//    return 0;
//}	



//string MyMerkletree(vector<string>& v)
//{
//	int vlenth = (int)v.size();
//	while (vlenth!=0)
//	{
//		for (int j = 0; j < vlenth - 1; j += 2)
//		{
//			sha256(v[j] + v[j + 1]);
//			printf("sha256(mkt[%d]+mkt[%d]) = %s\n", j, j + 1, sha256(v[j*2] + v[j*2 + 1]));
//		}
//		vlenth /= 2;
//		
//	}
//	return ;
//}

string nounce(string block)
{
	int num = 0;
	string NC;
	time_t start,end;

	time(&start);
	while (1)
	{
		NC = sha256(sha256(block + to_string(num)));

		printf("%10d:%s\r", num, NC.c_str());
		if (NC.substr(0, 4) == "0000")
		{
			time(&end);
			
			break;
		}
		num++;
	}
	printf("\n실행시간 %5.0f sec", difftime(end, start));
	printf("\n");
	return NC;
}
string Merkletree(vector<string>& v)
{
	int count = (int)v.size();
	if (count % 2 == 1) // vector 원소 갯수가 홀수면 마지막 원소를 복사해 넣어준다.
		v.push_back(v[count - 1]);

	vector<string> t;
	count = (int)v.size() / 2; // 두개를 더해서 해쉬함으로 해쉬 횟수는 점점 반감한다.
	


	for (int i = 0; i < count ; i++)
	{
		string s = sha256(sha256(v[2*i] + v[2*i+1]));
		t.push_back(s);
		cout << s << endl;
	}


	if (count == 1) //해쉬 횟수가 반감하다 1이됬을때 함수를 종료한다.
		return t[0];



	return Merkletree(t);
}

int main()
{
	//tr = transaction
	vector<string>tr{
			"sender:abcdefg,receiver:123,amount:1,tid:100",
			"sender:aaa,receiver:123,amount:1,tid:101",
			"sender:bbb,receiver:123,amount:1,tid:102",
			"sender:ccc,receiver:123,amount:1,tid:103",
			"sender:ddd,receiver:123,amount:1,tid:104",
			"sender:eee,receiver:123,amount:1,tid:105",
			"sender:fff,receiver:123,amount:1,tid:106",
			"sender:ggg,receiver:123,amount:1,tid:107"
	};
	vector<string>mkt; //트랜잭션을 해시한 해시값의 배열
		
	for (int i = 0; i < tr.size(); i++)
	{
		mkt.push_back(sha256(sha256(tr[i])));
	}
	string hash = Merkletree(mkt);
	string block = "bid:100, presvH:aaaaaa, time: 2020.10.16.15.21"+ hash;
	cout << "---------------------------------------------------------" << endl;
	cout << "result:" << hash << endl;
	cout << "---------------------------------------------------------" << endl;
	nounce(block);
	cout << "---------------------------------------------------------" << endl;
}


