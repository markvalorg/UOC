
using UnityEngine;
using System;


public class Test_Script : MonoBehaviour {
	void Update () {
        if (Time.frameCount % 3 == 0)
             Debug.Log("UOC Log: " + Time.frameCount);
        if (Time.frameCount % 5 == 0)
            Debug.LogError("UOC LogError: " + Time.frameCount);
        if (Time.frameCount % 7 == 0)
            Debug.LogWarning("UOC LogWarning: " + Time.frameCount);
        if(Time.frameCount % 9 == 0)
            Debug.LogAssertion("UOC LogWarning: " + Time.frameCount);
        if (Time.frameCount % 11 == 0)
        {
            try
            {
                throw new Exception("UOC LogException: " + Time.frameCount);
            }
            catch (Exception e)
            {
                Debug.LogException(e, this);
            }
        }
    }
}
