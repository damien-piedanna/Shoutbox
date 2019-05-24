(function () {
    "use strict";
    let current_shoutboxs;
    let shoutboxid;
    let current_messages = [];
    let user;
    let window_focus = true;

    $(document).ready(function() {
        $(window).focus(function() {
            window_focus = true;
        }).blur(function() {
            window_focus = false;
        });
        $.ajax({
            url: 'ajax/is_connected.php',
        }).done(function (result) {
            if (result.hasOwnProperty('success')) {
                if (result.success) { //connectée
                    if (result.hasOwnProperty('user'))
                        user = result.user;
                    loadNavbar();
                    loadShoutbox();
                    get_infos(true);
                    setInterval(function() {
                        if(window_focus) {
                            console.log('mise à jour...');
                            get_infos(false);
                        }
                    }, 2000);
                } else { //pas connectée
                    loadLoginForm();
                }
            }
        });
    });

    /**
     * Déconnecte l'utilisateur
     */
    function logout() {
        $.ajax({
            url: "ajax/logout.php",
        }).done(function (result) {
            if (result.hasOwnProperty('success'))
                if (result.success)
                    window.location.reload()
        });
    }

    /**
     * Charge le formulaire de connexion.
     */
    function loadLoginForm() {
        $('#main').append(
            $('<form />')
                .addClass('form-signin')
                .attr({
                    'accept-charset': 'UTF-8',
                    'id': 'login-form',
                }).append(
                $('<img />')
                    .addClass('mb-4 rounded mx-auto d-block')
                    .attr({
                        src: '/resources/img/logo.ico',
                        width: 72,
                        heigt: 72,
                    }),
                $('<h1 />')
                    .addClass('h3 mb-3 font-weight-normal text-center')
                    .html('Connexion'),
                $('<div />')
                    .attr({id:'alert'}),
                $('<input />')
                    .addClass('form-control')
                    .attr({
                        type: 'text',
                        name: 'login',
                        placeholder: 'Pseudo',
                        autocomplete: 'username'
                    }),
                $('<input />')
                    .addClass('form-control')
                    .attr({
                        type: 'password',
                        name: 'password',
                        placeholder: 'Mot de passe',
                        autocomplete: 'current-password'
                    }),
                $('<button />')
                    .addClass('btn btn-lg btn-primary btn-block mt-3')
                    .attr({type: 'submit'})
                    .html('Se connecter'),
                $('<p />')
                    .addClass('mt-3 text-muted text-center')
                    .html('Shoutbox')
            ).submit(function(e) {
                $.ajax({
                    url: "ajax/login.php",
                    method: 'post',
                    data: $(this).serialize(),
                }).done(function (result) {
                    console.log(result);
                    if (result.hasOwnProperty('msg_err')) {
                        $("#alert").empty().append(
                            '<div class="alert alert-warning alert-dismissible fade show" style="margin-bottom: 5px" role="alert">' +
                            result.msg_err +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '</div>').hide().fadeIn(500);
                    } else {
                        window.location.reload();
                    }
                });
                return false;
            })
        );
    }

    /**
     * Charge la navbar sans ses options.
     */
    function loadNavbar() {
        $('#main').before($('<ul />').addClass('nav nav-tabs justify-content-center fixed-top').attr({id: 'navbar'}));
    }

    /**
     * Charge la structure de base de la shoutbox.
     */
    function loadShoutbox() {
        $('#main').append(
            $('<div />')
                .addClass('box box-primary direct-chat direct-chat-primary')
                .append(
                    $('<div />')
                        .addClass('box-header with-border')
                        .append(
                            $('<h3 />')
                                .addClass('box-title'),
                            $('<div />')
                                .addClass('box-tools pull-right')
                                .append(
                                    $('<button />')
                                        .addClass('btn btn-sm btn-danger')
                                        .attr({id: 'logout_btn'})
                                        .html('Déconnexion')
                                        .click(function(){logout()})
                                ),
                        ),
                    $('<div />')
                        .addClass('box-body')
                        .append(
                            $('<div />')
                                .addClass('direct-chat-messages')
                                .attr({id: 'messages'})
                        ),
                    $('<div />')
                        .addClass('box-footer')
                        .append(
                            $('<form />')
                                .attr({id: 'chat'})
                                .append(
                                    $('<div />')
                                        .addClass('input-group')
                                        .append(
                                            $('<input />')
                                                .addClass('form-control')
                                                .attr({
                                                    type: 'text',
                                                    name: 'message',
                                                    id: 'message',
                                                    placeholder: 'Votre message...'
                                                }),
                                            $('<span />')
                                                .addClass('input-group-btn')
                                                .append(
                                                    $('<button />')
                                                        .addClass('btn btn-primary btn-flat')
                                                        .html('Envoyer')
                                                )
                                        )
                                )
                                .submit(function(e) {
                                    //Petit 'easter egg'
                                    if($('#message').val() === '/play') {
                                        window.location.href = "https://aure-rob.alwaysdata.net";
                                        return false;
                                    }
                                    $.ajax({
                                        url: "ajax/send_message.php",
                                        method: 'post',
                                        data: $(this).serialize(),
                                    }).done(function (result) {
                                        if (result.hasOwnProperty('success')) {
                                            if(result.success) {
                                                $('#message').val('');
                                                get_infos(false);
                                            } else {
                                                showModal("Erreur", result.msg_err);
                                            }
                                        }
                                    });
                                    return false;
                                })
                        )
                )
        );
    }

    /**
     * Permet à l'utilisateur de changer de shoutbox.
     * @param id - ID de la shoutbox.
     */
    function changeShoutbox(id) {
        if(id === shoutboxid)
            return;
        $.ajax({
            url: "ajax/change_shoutbox.php",
            method: 'post',
            data: {'id' : id},
        }).done(function (result) {
            if (result.hasOwnProperty('success')) {
                $('#messages').empty();
                get_infos(false);
            }
        });
    }

    /**
     * Récupère les informations génerales à afficher.
     * @param first - Est ce que c'est la première fois qu'on récupère les infos.
     */
    function get_infos(first) {
        $.ajax({
            url: "ajax/get_infos.php"
        }).done(function (result) {
            if (result.hasOwnProperty('success')) {

                let newshout = false;
                if (result.hasOwnProperty('shoutboxid')) {
                    if(shoutboxid !== result.shoutboxid) {
                        newshout = true;
                    }
                    shoutboxid = result.shoutboxid;
                }

                if (result.hasOwnProperty('messages'))
                    loadMessages(result.messages, first);

                if (result.hasOwnProperty('shoutboxs')) {
                    let shoutboxs = result.shoutboxs;
                    if(JSON.stringify(current_shoutboxs) !== JSON.stringify(shoutboxs) || newshout) {
                        let navbar  = $('#navbar');
                        navbar.empty();
                        for(let i = 0; i < shoutboxs.length; i++) {
                            navbar.append(
                                $('<li />')
                                    .addClass('nav-item')
                                    .append(
                                        $('<a />')
                                            .addClass('nav-link')
                                            .html(shoutboxs[i].title)
                                            .attr({id: 'shoutbox' + shoutboxs[i].id, href: 'javascript:void(0)'})
                                            .click(function(){changeShoutbox(shoutboxs[i].id)}),
                                    )
                            );
                            if(shoutboxid === shoutboxs[i].id) {
                                $('#shoutbox' + shoutboxs[i].id).addClass('active');
                                let title_motd = $('#main > div > div > h3');
                                if(title_motd.text() !== (shoutboxs[i].title + ' | ' + shoutboxs[i].motd))
                                    title_motd.html(shoutboxs[i].title + ' | ' + shoutboxs[i].motd).hide().fadeIn(500);
                            }
                        }
                        current_shoutboxs = shoutboxs;
                    }
                }

                //Vérification de l'état de banissement
                if (result.hasOwnProperty('user')) {
                    if(result.user.hasOwnProperty('ban')) {
                        if(result.user.ban !== null) {
                            showModal("Vous avez été banni du site!", "Vous allez être déconnecté dans quelques secondes car vous avez été banni pour la raison suivante : " + result.user.ban);
                            setTimeout(function(){logout()}, 5000);
                        }
                    }
                }
            }
        });
    }

    /**
     * Modifie les infos du modal et l'affiche.
     * @param title - Titre du modal.
     * @param body - Contenu du modal.
     * @param input - Besoin d'un input ?
     */
    function showModal(title, body) {
        let Modal = $('#modal');
        Modal.find('.modal-title').empty().append(title);
        Modal.find('.modal-body > div').empty().append(body);
        Modal.modal('show');
    }

    /**
     * Charge ou modife la liste des messages dans la shoutbox si besoin.
     * @param messages - Tableau de messages à charger.
     * @param first - Est-ce la première fois que l'on charge des messages de cette shoutbox ?
     */
    function loadMessages(messages, first) {
        let hasmodifs = false;
        for(let i = 0; i < messages.length; i++) {
            let idold = current_messages.findIndex(x => x.id === messages[i].id);
            switch (true) {
                case (idold === -1): //Nouveau message
                    if(Boolean(Number(messages[i].appear))) {
                        loadMessage(messages[i], 0);
                        hasmodifs = true;
                    }
                    break;
                case (Boolean(Number(messages[i].appear)) !== Boolean(Number(current_messages[idold].appear))): //L'état cacher/affichher du message a été changé
                    if(Boolean(Number(messages[i].appear))) { //Réintégré
                        if(i === 0) { //Si c'est le premier message qui est réintégré
                            loadMessage(messages[i], 1, null, true);
                        } else { //Savoir où réintégré le message
                            let j = i-1;
                            while(true) {
                                if(Boolean(Number(messages[j].appear))) {
                                    loadMessage(messages[i], 1, messages[j].id);
                                    break;
                                }
                                if(j === 0) {
                                    loadMessage(messages[i], 1, null, true);
                                    break;
                                }
                                --j;
                            }
                        }
                    } else { //Supprimé
                        unloadMessage(current_messages[idold].id);
                    }
                    hasmodifs = true;
                    break;
                case (messages[i].appear && first || (JSON.stringify(messages[i]) !== JSON.stringify(current_messages[idold]))): //Message modifié
                    loadMessage(messages[i], 2);
                    hasmodifs = true;
                    break;
            }
            if(!hasmodifs) //Si il y pas de modifs, on met au moins à jour le timestamp
                $('#message' + messages[i].id + ' .direct-chat-timestamp').html(getMessageTime(messages[i].created_at));
        }
        if(hasmodifs)
            ScrollToBottom();
        current_messages = messages;
    }

    /**
     * Renvoie le string à afficher en fonction de la date de creation du message.
     * @param date - Date de création du message.
     * @returns {string} - String à afficher sur le message.
     */
    function getMessageTime(date)
    {
        let date1 = new Date(date);
        let date2 = new Date();
        let strDate;

        if(Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60)) === 1) {
            let diff = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60));
            if(diff > 1)
                strDate = "Il y a " + diff + " minutes";
            else
                strDate = "Il y a un instant";
        } else {
            let hours = date1.getHours() + ":" + (date1.getMinutes()<10?'0':'') + date1.getMinutes();
            if(Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)) === 1 && date1.getDay() === date2.getDay())
                strDate = "Aujourd'hui à " + hours;
            else
                strDate = date1.toLocaleDateString() + " à " + hours;

        }
        return strDate;
    }

    /**
     * Charge un message dans la shoutbox.
     * @param message - Le message chargé.
     * @param mode - [0 / Message nouveau] [1 / Message réintégré] [2 / Message modifié].
     * Les paramètres suivant servent uniquement pour le mode 1.
     * @param afterid - Id du message à laquel on doit ajouter le message à la suite.
     * @param first - Est-ce le premier message qui est réintégré ?
     */
    function loadMessage(message, mode, afterid, first) {

        let time = getMessageTime(message.created_at);

        //Base du message.
        let msg = $('<div />')
            .addClass('direct-chat-msg')
            .attr({
                id: 'message' + message.id,
            })
            .append(
                $('<div />')
                    .addClass('direct-chat-info clearfix')
                    .append(
                        $('<span />')
                            .addClass('direct-chat-name pull-left')
                            .html(message.author),
                        $('<span />')
                            .addClass('direct-chat-timestamp pull-right')
                            .html(time)
                    ),
                $('<img />')
                    .addClass('direct-chat-img')
                    .attr({
                        src: '/resources/img/user/' + message.author_avatar,
                        alt: 'Img'
                    }),
                $('<div />')
                    .addClass('direct-chat-text')
                    .html(message.content),
            ).hide().fadeIn(500);


        if(message.author_role === 'admin') //Pseudo en rouge si admin.
            msg.find(".direct-chat-name").addClass('text-danger');
        else if(message.author_role === 'modo') //Pseudo en vert si modo.
            msg.find(".direct-chat-name").addClass('text-success');
        if(user.role !== 'member') //Ajout des options si modo ou admin.
        {
            msg.find(".direct-chat-text").addClass('direct-chat-text-with-options');
            msg.find(".direct-chat-info").after(
                $('<div />')
                    .addClass('btn-group pull-right direct-chat-options')
                    .append(
                        $('<button />')
                            .addClass('btn btn-sm btn-secondary dropdown-toggle')
                            .attr({
                                type: 'button',
                                'data-toggle': 'dropdown',
                                'aria-haspopup': 'true',
                                'aria-expanded': 'false'
                            }),
                        $('<div />')
                            .addClass('dropdown-menu')
                            .attr({'aria-labelledby': 'dropdownMenuButton'})
                            .append(
                                $('<div />')
                                    .addClass('dropdown-item')
                                    .css('cursor', 'pointer')
                                    .html('Modifier')
                                    .click(function(){editMessage(message.id)}),
                                $('<div />')
                                    .addClass('dropdown-item'  )
                                    .css('cursor', 'pointer')
                                    .html('Supprimer')
                                    .click(function(){deleteMessage(message.id)}),
                            ),
                    ),
            );
        }
        //Ajout de la possibilité de ban.
        if(message.author_id !== user.id && message.author_role !== 'admin')
        {
            msg.find(".dropdown-menu").append(
                $('<div />')
                    .addClass('dropdown-item')
                    .css('cursor', 'pointer')
                    .html('Bannir')
                    .click(function(){banUser(message.id)})
            );
        }
        //Couleur différente si c'est un message de l'utilisateur.
        if(message.author_id === user.id)
            msg.find(".direct-chat-text").addClass('direct-chat-me');

        let messagesdiv = $('#messages');
        switch (mode) {
            case 0: //Nouveau message
                messagesdiv.append(msg);
                break;
            case 1: //Message réintégré
                if(first) //Exception si c'est le premier message qui est réintégré
                    messagesdiv.prepend(msg);
                else
                    $('#message' + afterid).after(msg);
                break;
            case 2: //Message modifié
                $('#message' + message.id).replaceWith(msg);
                break;
            default: //Ne devrais pas arrivé.
                console.log("mauvais usage");
        }

    }

    /**
     * Fait disparaitre un message de la shoutbox.
     * @param id - ID du message.
     */
    function unloadMessage(id) {
        $('#message' + id).fadeOut(500, function() {$(this).remove();});
    }

    /**
     * Affiche un modal pour modifier un message.
     * @param id
     */
    function editMessage(id) {
        let message = current_messages[current_messages.findIndex(x => x.id === id)];
        let div = $('<form />')
            .append(
                $('<input />')
                    .addClass('form-control')
                    .attr({
                        type: 'text',
                        name: 'message',
                        placeholder: 'Nouveau message',
                        value: message.content,
                    }),
                $('<input />')
                    .attr({
                        type: 'hidden',
                        name: 'idOldMessage',
                        value: message.id,
                    }),
                $('<hr />'),
                $('<button />')
                    .addClass('btn btn-primary btn-flat pull-right')
                    .html(' Modifier')
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-edit')
                    ),
                $('<h5 />')
                    .addClass('font-weight-bold pull-left pt-2')
                    .html(' ' + message.author)
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-lg fa-user')
                    ),
            )
            .submit(function(e) {
                    $.ajax({
                        url: "ajax/send_message.php",
                        method: 'post',
                        data: $(this).serialize(),
                    }).done(function (result) {
                        if (result.hasOwnProperty('success'))
                            if(result.success) {
                                $('#modal').modal('hide');
                                get_infos(false);
                            } else {
                                if (result.hasOwnProperty('msg_err'))
                                    showModal("Erreur", result.msg_err);
                            }
                    });
                    return false;
                }
            );
        if(message.author_role === 'admin')
            div.find(".pull-left").addClass('text-danger');
        else if(message.author_role === 'modo')
            div.find(".pull-left").addClass('text-success');
        showModal('Modification du message #' + message.id, div);
    }

    /**
     * Supprime un modal pour modifier un message.
     * @param id
     */
    function deleteMessage(id) {
        let message = current_messages[current_messages.findIndex(x => x.id === id)];
        let div = $('<form />')
            .append(
                $('<div />')
                    .addClass('mb-4')
                    .html('Message : ' + message.content),
                $('<hr />'),
                $('<button />')
                    .addClass('btn btn-danger btn-flat pull-right')
                    .html(' Supprimer')
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-trash')
                    ),
                $('<h5 />')
                    .addClass('font-weight-bold pull-left pt-2')
                    .html(' ' + message.author)
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-lg fa-user')
                    ),
            )
            .submit(function(e) {
                    $.ajax({
                        url: "ajax/delete_message.php",
                        method: 'post',
                        data: {'idOldMessage' : message.id},
                    }).done(function (result) {
                        if (result.hasOwnProperty('success'))
                            if(result.success) {
                                $('#modal').modal('hide');
                                get_infos(false);
                            } else {
                                if (result.hasOwnProperty('msg_err'))
                                    showModal("Erreur", result.msg_err);
                            }
                    });
                    return false;
                }
            );
        if(message.author_role === 'admin')
            div.find(".pull-left").addClass('text-danger');
        else if(message.author_role === 'modo')
            div.find(".pull-left").addClass('text-success');
        showModal('Suppression du message #' + message.id, div);
    }

    /**
     * Affiche un modal pour bannir un utilisateur.
     * @param id
     */
    function banUser(id) {
        let message = current_messages[current_messages.findIndex(x => x.id === id)];
        let div = $('<form />')
            .append(
                $('<input />')
                    .addClass('form-control')
                    .attr({
                        type: 'text',
                        name: 'raison',
                        placeholder: 'Raison',
                    }),
                $('<input />')
                    .attr({
                        type: 'hidden',
                        name: 'userid',
                        value: message.author_id,
                    }),
                $('<hr />'),
                $('<button />')
                    .addClass('btn btn-danger btn-flat pull-right')
                    .html(' Bannir')
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-gavel')
                    ),
                $('<h5 />')
                    .addClass('font-weight-bold pull-left pt-2')
                    .html(' ' + message.author)
                    .prepend(
                        $('<i />')
                            .addClass('fa fa-lg fa-user')
                    ),
            )
            .submit(function(e) {
                    $.ajax({
                        url: "ajax/ban_user.php",
                        method: 'post',
                        data: $(this).serialize(),
                    }).done(function (result) {
                        if (result.hasOwnProperty('success'))
                            if(result.success)
                                $('#modal').modal('hide');
                            else
                            if (result.hasOwnProperty('msg_err'))
                                showModal("Erreur", result.msg_err);
                    });
                    return false;
                }
            );
        if(message.author_role === 'admin')
            div.find(".pull-left").addClass('text-danger');
        else if(message.author_role === 'modo')
            div.find(".pull-left").addClass('text-success');
        showModal('Bannir ' + message.author, div);
    }

    /**
     * Mets la scrollbar de la shoutbox tout en bas.
     */
    function ScrollToBottom() {
        let objDiv = document.getElementById("messages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
})();