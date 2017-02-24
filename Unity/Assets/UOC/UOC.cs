
using UnityEngine;
//using SocketIO;
using System.Collections;
using System.Collections.Generic;

public class UOC : MonoBehaviour {

    public static UOC UOC_Root;
   // SocketIOComponent socket; // TO use with socketio
    Dictionary<string, string> data = new Dictionary<string, string>();

    public string NodeJS_IP;
    public string NodeJS_PORT;

    void Awake()
    {
        
        data["ComputerName"] = SystemInfo.deviceName;
        //  socket = GetComponent<SocketIOComponent>(); // TO use with socketio
        MakeThisPermanent();
        

    }

    public void MessageToServer(string msg = null)
    {
        if (msg == null) data["Msg"] = " Error // No message provided.";
        else data["Msg"] = msg;
        StartCoroutine(SendToUOCServer(data));
    }

    void OnEnable()
    {
        Application.logMessageReceivedThreaded += HandleLog;

    }
    void OnDisable()
    {
        Application.logMessageReceivedThreaded -= HandleLog;
    }

    public void HandleLog(string logString, string stackTrace, LogType type)
    {
        data["log"] = System.Uri.EscapeUriString(logString);
        data["stackTrace"] = System.Uri.EscapeUriString(stackTrace);
        switch (type)
        {
            case LogType.Error:
                data["LogType"] = "Error";
                break;
            case LogType.Assert:
                data["LogType"] = "Assert";
                break;
            case LogType.Exception:
                data["LogType"] = "Exception";
                break;

            case LogType.Warning:
                data["LogType"] = "Warning";
                break;

            case LogType.Log:
                data["LogType"] = "Log";
                break;
            default:
                data["LogType"] = "Default";
                break;
        }

        StartCoroutine(SendToUOCServer(data));
    }

    IEnumerator SendToUOCServer(Dictionary<string, string>  data)
    {
        // To use socketio
        //socket.Emit("UOC", new JSONObject(data));
        WWW www;
        WWWForm form = new WWWForm();
        form.AddField("ComputerName", data["ComputerName"]);
        form.AddField("LogType", data["LogType"]);
        form.AddField("log", data["log"]);
        form.AddField("stackTrace", data["stackTrace"]);

        var headers = form.headers;
        headers["content-type"] = "application/json";

        www = new WWW("http://"+ NodeJS_IP + ":"+ NodeJS_PORT +"/api", form.data, headers);
        yield return www;
       // Debug.Log(www.text); // To know the return result
    }

    private void MakeThisPermanent()
    {
        if (UOC_Root == null)
        {
            DontDestroyOnLoad(gameObject);
            UOC_Root = this;
        }
        else
        {
            if (UOC_Root != this)
            {
                Destroy(gameObject);
            }
        }
    }

    public class MyObject
    {
        public string data;
    }
}
