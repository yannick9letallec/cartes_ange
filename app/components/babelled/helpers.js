"use strict";

module.exports = {
  services: function services(method, url, data) {
    var vueComponent = this,
        protocol = '';
    return new Promise(function (resolve, reject) {
      var fname = "SERVICES";

      if (window.XMLHttpRequest) {
        console.info("OK : [ " + fname + " ] XHR Object Found");
        var xhr = new XMLHttpRequest();
      } else {
        console.info("KO : [ " + fname + " ] No XHR Object Found");
        return false;
      }

      xhr.timeout = 5000;
      xhr.addEventListener('readystatechange', function (event) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("SERVICE RESPONSE : ");
          console.log(xhr.responseText);
          resolve({
            vueComponent: vueComponent,
            data: JSON.parse(xhr.responseText)
          });
        }
      });

      xhr.onerror = function () {
        reject(Error(xhr.statusText));
      };

      xhr.ontimeout = function () {
        reject('XHR Timeout : ' + Error('in error constructor ' + xhr.statusText));
      };

      var params = '';

      if (data) {
        console.log("SERVICE : Données Recues : ");

        for (var props in data) {
          console.log(props);
          params += props + '=' + data[props];
        }
      }

      xhr.open(method, location.protocol + '//local.exemple.bzh/services/' + url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data ? JSON.stringify(data) : null);
    });
  },
  verifierFormulaire: function verifierFormulaire(event) {
    var fname = "VERIFIER FORMULAIRE";
    var form_name = event.target.form.id;
    var pseudo_err_message = 'Pseudo > 5 caractères';
    var email_err = 'Rentrez un email valide';
    var mdp_err_message = 'Mot de Passe  > 5 caractères';
    var mdp_differents = 'Les mots doivent correspondre';
    var message = pseudo_err_message + "\n" + mdp_err_message,
        pseudo = document.getElementById('pseudo').value,
        mdp = document.getElementById('mdp').value,
        info = document.getElementById('info'),
        classe_erreur = info.classList.contains('afficher_message_erreur'),
        submit = document.querySelector('[id=login] button');
    console.log(pseudo, mdp);

    switch (form_name) {
      case 'login':
        if (pseudo.length > 5 && mdp.length > 5) {
          info.innerText = null;
          submit.disabled = false;
        } else {
          console.error("KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur");
          info.innerText = message;
          submit.disabled = true;
        }

        break;

      case 'creer_compte':
        var email = document.getElementById('email').value,
            confirmer_mdp = document.getElementById('confirmer_mdp').value;

        if (pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat(email) && mdp === confirmer_mdp) {
          submit.disabled = false;
          info.innerText = null;
          if (classe_erreur) info.classList.toggle('afficher_message_erreur');
        } else {
          console.error("KO : [ " + fname + " ] Données invalides pour la création du compte");
          submit.disabled = true;
          if (!classe_erreur) info.classList.toggle('afficher_message_erreur');
          info.innerText = message + '\n' + email_err + '\n' + mdp_differents;
        }

        break;

      case 'confirmer_invitation':
        var confirmer_mdp_inv = document.getElementById('confirmer_mdp_inv').value,
            mdp_inv = document.getElementById('mdp_inv').value;
        console.log("CONFIRMER INVITATIOH : " + mdp_inv + ' / ' + confirmer_mdp_inv);

        if (mdp_inv.length > 5 && mdp_inv === confirmer_mdp_inv) {
          submit.disabled = false;
        } else {
          console.error("KO : [ " + fname + " ] Données invalides pour confirmer l'invitation du membre");
          submit.disabled = true;
        }

        break;
    }
  },
  verifierEmailFormat: function verifierEmailFormat(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return regex.test(email);
  },
  viderDiv: function viderDiv(div_id) {
    var div = document.getElementById(div_id);

    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }
};