import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { PatientsAttendedModel } from 'src/models/patients-attended.model';
import { GlobalModel } from './global.model';
import { DoctorsModel } from 'src/models/doctors.model';
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
  EventConnectionEstablished = new EventEmitter<Boolean>();
  EventGetAllPatients = new EventEmitter<Array<PatientsAttendedModel>>();
  EventCallPatient = new EventEmitter<PatientsAttendedModel>();
  EventCompletePatient = new EventEmitter<PatientsAttendedModel>();
  EventChatMessage = new EventEmitter<string>();
  EventGetAllDoctors = new EventEmitter<DoctorsModel>();
  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor(public global: GlobalModel) {
  }
  public GetAllPatients() {
    this._hubConnection.invoke("GetPatientAll")
      .catch(function (err) {
        console.log(err);
      });
  }

  public CallPatient(callPatient: PatientsAttendedModel) {
    console.log(callPatient);
    this._hubConnection.invoke('PatientCall', callPatient)
      .catch(function (err) {
        console.log(err);
      });
  }

  public PatientAttended(attendPatient: PatientsAttendedModel) {
    console.log(attendPatient);
    this._hubConnection.invoke('PatientAttended', attendPatient)
      .catch(function (err) {
        console.log(err);
      });
  }

  public SendChatMessage(chatMessage) {
    this._hubConnection.invoke('SendChatMessage', chatMessage)
      .catch(err => {
        console.log(err);
      });
  }

  public LoadActiveDoctors() {
    this._hubConnection.invoke('GetActiveDoctors').catch(err => {
      console.log(err);
    });
  }

  public Connect() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }
  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(window.location.origin + '/NotificationHub?token=' + this.global.token)
      .build();
    this._hubConnection.serverTimeoutInMilliseconds = 50000000; // 100 second

  }

  private startConnection(): void {

    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.EventConnectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000000);
      });

    this._hubConnection.onclose(function (e) {
      alert('Connection Closed');
      //setTimeout(function () { this.startConnection(); }, 5000);

    });

  }

  private registerOnServerEvents(): void {

    this._hubConnection.on('GetAllPatients', (data: any) => {
      var obj: any = JSON.parse(data)
      this.EventGetAllPatients.emit(obj);
    });

    this._hubConnection.on('CallPatient', (data: any) => {
      var obj: any = JSON.parse(data)

      this.EventCallPatient.emit(obj);
    });


    this._hubConnection.on('CompletePatient', (data: any) => {
      console.log('Complete Patient' + data);
      var obj: any = JSON.parse(data)
      this.EventCompletePatient.emit(obj);
    });

    this._hubConnection.on('ChatMessage', (data: any) => {
      // console.log('Message' + data);
      const msg: any = JSON.parse(data);
      this.EventChatMessage.emit(msg);
    });

    this._hubConnection.on('GetAllDoctors', (data: any) => {
      const jsonData: any = JSON.parse(data);
      this.EventGetAllDoctors.emit(jsonData);
    });

  }
}