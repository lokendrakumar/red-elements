/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Context,
  $
} from '../context'

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class Deploy extends Context {
  /**
   * options:
   *   type: "default" - Button with drop-down options - no further customisation available
   *   type: "simple"  - Button without dropdown. Customisations:
   *      label: the text to display - default: "Deploy"
   *      icon : the icon to use. Null removes the icon. default: "red/images/deploy-full-o.png"
   */

  public deploymentType: any
  public deploymentTypes: any

  constructor(options: any = {}) {
    super()

    const {
      ctx,
    } = this

    const {
      changeDeploymentType,
      save,
      resolveConflict
    } = this.rebind([
        'changeDeploymentType',
        'save',
        'resolveConflict'
      ])

    var deploymentTypes = {
      "full": {
        img: "red/images/deploy-full-o.png"
      },
      "nodes": {
        img: "red/images/deploy-nodes-o.png"
      },
      "flows": {
        img: "red/images/deploy-flows-o.png"
      }
    }

    var ignoreDeployWarnings = {
      unknown: false,
      unusedConfig: false,
      invalid: false
    }

    var deploymentType = "full";

    var deployInflight = false;

    var currentDiff = null;

    options = options || {};
    var type = options.type || "default";

    if (type == "default") {
      $('<li><span class="deploy-button-group button-group">' +
        '<a id="btn-deploy" class="deploy-button disabled" href="#">' +
        '<span class="deploy-button-content">' +
        '<img id="btn-deploy-icon" src="red/images/deploy-full-o.png"> ' +
        '<span>' + ctx._("deploy.deploy") + '</span>' +
        '</span>' +
        '<span class="deploy-button-spinner hide">' +
        '<img src="red/images/spin.svg"/>' +
        '</span>' +
        '</a>' +
        '<a id="btn-deploy-options" data-toggle="dropdown" class="deploy-button" href="#"><i class="fa fa-caret-down"></i></a>' +
        '</span></li>').prependTo(".header-toolbar");
      ctx.menu.init({
        id: "btn-deploy-options",
        options: [{
          id: "deploymenu-item-full",
          toggle: "deploy-type",
          icon: "red/images/deploy-full.png",
          label: ctx._("deploy.full"),
          sublabel: ctx._("deploy.fullDesc"),
          selected: true,
          onselect: function (s) {
            if (s) {
              changeDeploymentType("full")
            }
          }
        },
        {
          id: "deploymenu-item-flow",
          toggle: "deploy-type",
          icon: "red/images/deploy-flows.png",
          label: ctx._("deploy.modifiedFlows"),
          sublabel: ctx._("deploy.modifiedFlowsDesc"),
          onselect: function (s) {
            if (s) {
              changeDeploymentType("flows")
            }
          }
        },
        {
          id: "deploymenu-item-node",
          toggle: "deploy-type",
          icon: "red/images/deploy-nodes.png",
          label: ctx._("deploy.modifiedNodes"),
          sublabel: ctx._("deploy.modifiedNodesDesc"),
          onselect: function (s) {
            if (s) {
              changeDeploymentType("nodes")
            }
          }
        }
        ]
      });
    } else if (type == "simple") {
      var label = options.label || ctx._("deploy.deploy");
      var icon = 'red/images/deploy-full-o.png';
      if (options.hasOwnProperty('icon')) {
        icon = options.icon;
      }

      $('<li><span class="deploy-button-group button-group">' +
        '<a id="btn-deploy" class="deploy-button disabled" href="#">' +
        '<span class="deploy-button-content">' +
        (icon ? '<img id="btn-deploy-icon" src="' + icon + '"> ' : '') +
        '<span>' + label + '</span>' +
        '</span>' +
        '<span class="deploy-button-spinner hide">' +
        '<img src="red/images/spin.svg"/>' +
        '</span>' +
        '</a>' +
        '</span></li>').prependTo(".header-toolbar");
    }

    $('#btn-deploy').click(function (event) {
      event.preventDefault();
      save();
    });

    ctx.actions.add("core:deploy-flows", save);

    const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
    confirmDeployDialog.dialog({
      title: ctx._('deploy.confirm.button.confirm'),
      modal: true,
      autoOpen: false,
      width: 550,
      height: "auto",
      buttons: [{
        text: ctx._("common.label.cancel"),
        click: function () {
          confirmDeployDialog.dialog("close");
        }
      },
      {
        id: "node-dialog-confirm-deploy-review",
        text: ctx._("deploy.confirm.button.review"),
        class: "primary disabled",
        click: function () {
          if (!$("#node-dialog-confirm-deploy-review").hasClass('disabled')) {
            ctx.diff.showRemoteDiff();
            confirmDeployDialog.dialog("close");
          }
        }
      },
      {
        id: "node-dialog-confirm-deploy-merge",
        text: ctx._("deploy.confirm.button.merge"),
        class: "primary disabled",
        click: function () {
          ctx.diff.mergeDiff(currentDiff);
          confirmDeployDialog.dialog("close");
        }
      },
      {
        id: "node-dialog-confirm-deploy-deploy",
        text: ctx._("deploy.confirm.button.confirm"),
        class: "primary",
        click: function () {
          const deployType = <string>$("#node-dialog-confirm-deploy-type").val()
          var ignoreChecked = $("#node-dialog-confirm-deploy-hide").prop("checked");
          if (ignoreChecked) {
            ignoreDeployWarnings[deployType] = true;
          }
          save(true, /conflict/.test(deployType));
          confirmDeployDialog.dialog("close");
        }
      },
      {
        id: "node-dialog-confirm-deploy-overwrite",
        text: ctx._("deploy.confirm.button.overwrite"),
        class: "primary",
        click: function () {
          const deployType = <string>$("#node-dialog-confirm-deploy-type").val()
          save(true, /conflict/.test(deployType));
          confirmDeployDialog.dialog("close");
        }
      }
      ],
      create: function () {
        $("#node-dialog-confirm-deploy").parent().find("div.ui-dialog-buttonpane")
          .prepend('<div style="height:0; vertical-align: middle; display:inline-block; margin-top: 13px; float:left;">' +
          '<input style="vertical-align:top;" type="checkbox" id="node-dialog-confirm-deploy-hide"> ' +
          '<label style="display:inline;" for="node-dialog-confirm-deploy-hide" data-i18n="deploy.confirm.doNotWarn"></label>' +
          '<input type="hidden" id="node-dialog-confirm-deploy-type">' +
          '</div>');
      },
      open: function () {
        const deployType = <string>$("#node-dialog-confirm-deploy-type").val();
        if (/conflict/.test(deployType)) {
          const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
          confirmDeployDialog.dialog('option', 'title', ctx._('deploy.confirm.button.review'));
          $("#node-dialog-confirm-deploy-deploy").hide();
          $("#node-dialog-confirm-deploy-review").addClass('disabled').show();
          $("#node-dialog-confirm-deploy-merge").addClass('disabled').show();
          $("#node-dialog-confirm-deploy-overwrite").toggle(deployType === "deploy-conflict");
          currentDiff = null;
          $("#node-dialog-confirm-deploy-conflict-checking").show();
          $("#node-dialog-confirm-deploy-conflict-auto-merge").hide();
          $("#node-dialog-confirm-deploy-conflict-manual-merge").hide();

          var now = Date.now();
          ctx.diff.getRemoteDiff(function (diff) {
            var ellapsed = Math.max(1000 - (Date.now() - now), 0);
            currentDiff = diff;
            setTimeout(function () {
              $("#node-dialog-confirm-deploy-conflict-checking").hide();
              var d = Object.keys(diff.conflicts);
              if (d.length === 0) {
                $("#node-dialog-confirm-deploy-conflict-auto-merge").show();
                $("#node-dialog-confirm-deploy-merge").removeClass('disabled')
              } else {
                $("#node-dialog-confirm-deploy-conflict-manual-merge").show();
              }
              $("#node-dialog-confirm-deploy-review").removeClass('disabled')
            }, ellapsed);
          })


          $("#node-dialog-confirm-deploy-hide").parent().hide();
        } else {
          const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
          confirmDeployDialog.dialog('option', 'title', ctx._('deploy.confirm.button.confirm'));

          $("#node-dialog-confirm-deploy-deploy").show();
          $("#node-dialog-confirm-deploy-overwrite").hide();
          $("#node-dialog-confirm-deploy-review").hide();
          $("#node-dialog-confirm-deploy-merge").hide();
          $("#node-dialog-confirm-deploy-hide").parent().show();
        }
      }
    });

    ctx.events.on('nodes:change', function (state) {
      if (state.dirty) {
        window.onbeforeunload = function () {
          return ctx._("deploy.confirm.undeployedChanges");
        }
        $("#btn-deploy").removeClass("disabled");
      } else {
        window.onbeforeunload = null;
        $("#btn-deploy").addClass("disabled");
      }
    });

    var activeNotifyMessage;
    ctx.comms.subscribe("notification/runtime-deploy", function (topic, msg) {
      if (!activeNotifyMessage) {
        var currentRev = ctx.nodes.version();
        if (currentRev === null || deployInflight || currentRev === msg.revision) {
          return;
        }
        var message = $('<div>' + ctx._('deploy.confirm.backgroundUpdate') +
          '<br><br><div class="ui-dialog-buttonset">' +
          '<button>' + ctx._('deploy.confirm.button.ignore') + '</button>' +
          '<button class="primary">' + ctx._('deploy.confirm.button.review') + '</button>' +
          '</div></div>');
        $(message.find('button')[0]).click(function (evt) {
          evt.preventDefault();
          activeNotifyMessage.close();
          activeNotifyMessage = null;
        })
        $(message.find('button')[1]).click(function (evt) {
          evt.preventDefault();
          activeNotifyMessage.close();
          var nns = ctx.nodes.createCompleteNodeSet();
          resolveConflict(nns, false);
          activeNotifyMessage = null;
        })
        activeNotifyMessage = ctx.notify(message, null, true);
      }
    });
  }

  changeDeploymentType(type) {
    let {
      deploymentType,
      deploymentTypes
    } = this
    deploymentType = type;
    $("#btn-deploy-icon").attr("src", deploymentTypes[type].img);
  }

  getNodeInfo(node) {
    const {
      ctx
    } = this

    var tabLabel = "";
    if (node.z) {
      var tab = ctx.nodes.workspace(node.z);
      if (!tab) {
        tab = ctx.nodes.subflow(node.z);
        tabLabel = tab.name;
      } else {
        tabLabel = tab.label;
      }
    }
    var label = ctx.utils.getNodeLabel(node, node.id);
    return {
      tab: tabLabel,
      type: node.type,
      label: label
    };
  }

  sortNodeInfo(A, B) {
    if (A.tab < B.tab) {
      return -1;
    }
    if (A.tab > B.tab) {
      return 1;
    }
    if (A.type < B.type) {
      return -1;
    }
    if (A.type > B.type) {
      return 1;
    }
    if (A.name < B.name) {
      return -1;
    }
    if (A.name > B.name) {
      return 1;
    }
    return 0;
  }

  resolveConflict(currentNodes, activeDeploy) {
    $("#node-dialog-confirm-deploy-config").hide();
    $("#node-dialog-confirm-deploy-unknown").hide();
    $("#node-dialog-confirm-deploy-unused").hide();
    $("#node-dialog-confirm-deploy-conflict").show();
    $("#node-dialog-confirm-deploy-type").val(activeDeploy ? "deploy-conflict" : "background-conflict");
    const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
    confirmDeployDialog.dialog("open");
  }

  save(skipValidation, force) {
    let {
      ctx,
      getNodeInfo,
      ignoreDeployWarnings,
      sortNodeInfo,
      deployInflight,
      deploymentType,
      resolveConflict
    } = this.rebind([
        'getNodeInfo',
        'sortNodeInfo',
        'resolveConflict'
      ])

    if (!$("#btn-deploy").hasClass("disabled")) {
      if (!skipValidation) {
        var hasUnknown = false;
        var hasInvalid = false;
        var hasUnusedConfig = false;

        var unknownNodes = [];
        var invalidNodes = [];

        ctx.nodes.eachNode(function (node) {
          hasInvalid = hasInvalid || !node.valid;
          if (!node.valid) {
            invalidNodes.push(getNodeInfo(node));
          }
          if (node.type === "unknown") {
            if (unknownNodes.indexOf(node.name) == -1) {
              unknownNodes.push(node.name);
            }
          }
        });
        hasUnknown = unknownNodes.length > 0;

        var unusedConfigNodes = [];
        ctx.nodes.eachConfig(function (node) {
          if (node.users.length === 0 && (node._def.hasUsers !== false)) {
            unusedConfigNodes.push(getNodeInfo(node));
            hasUnusedConfig = true;
          }
        });

        $("#node-dialog-confirm-deploy-config").hide();
        $("#node-dialog-confirm-deploy-unknown").hide();
        $("#node-dialog-confirm-deploy-unused").hide();
        $("#node-dialog-confirm-deploy-conflict").hide();

        var showWarning = false;

        if (hasUnknown && !ignoreDeployWarnings.unknown) {
          showWarning = true;
          $("#node-dialog-confirm-deploy-type").val("unknown");
          $("#node-dialog-confirm-deploy-unknown").show();
          $("#node-dialog-confirm-deploy-unknown-list")
            .html("<li>" + unknownNodes.join("</li><li>") + "</li>");
        } else if (hasInvalid && !ignoreDeployWarnings.invalid) {
          showWarning = true;
          $("#node-dialog-confirm-deploy-type").val("invalid");
          $("#node-dialog-confirm-deploy-config").show();
          invalidNodes.sort(sortNodeInfo);
          $("#node-dialog-confirm-deploy-invalid-list")
            .html("<li>" + invalidNodes.map(function (A) {
              return (A.tab ? "[" + A.tab + "] " : "") + A.label + " (" + A.type + ")"
            }).join("</li><li>") + "</li>");

        } else if (hasUnusedConfig && !ignoreDeployWarnings.unusedConfig) {
          // showWarning = true;
          // $( "#node-dialog-confirm-deploy-type" ).val("unusedConfig");
          // $( "#node-dialog-confirm-deploy-unused" ).show();
          //
          // unusedConfigNodes.sort(sortNodeInfo);
          // $( "#node-dialog-confirm-deploy-unused-list" )
          //     .html("<li>"+unusedConfigNodes.map(function(A) { return (A.tab?"["+A.tab+"] ":"")+A.label+" ("+A.type+")"}).join("</li><li>")+"</li>");
        }
        if (showWarning) {
          $("#node-dialog-confirm-deploy-hide").prop("checked", false);
          const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
          confirmDeployDialog.dialog("open");
          return;
        }
      }

      var nns = ctx.nodes.createCompleteNodeSet();

      var startTime = Date.now();
      $(".deploy-button-content").css('opacity', 0);
      $(".deploy-button-spinner").show();
      $("#btn-deploy").addClass("disabled");

      var data = {
        flows: nns,
        rev: null
      };

      if (!force) {
        data.rev = ctx.nodes.version();
      }

      deployInflight = true;
      $("#header-shade").show();
      $("#editor-shade").show();
      $("#palette-shade").show();
      $("#sidebar-shade").show();
      $.ajax({
        url: "flows",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
          "Node-RED-Deployment-Type": deploymentType
        }
      }).done(function (data, textStatus, xhr) {
        ctx.nodes.dirty(false);
        ctx.nodes.version(data.rev);
        ctx.nodes.originalFlow(nns);
        if (hasUnusedConfig) {
          ctx.notify(
            '<p>' + ctx._("deploy.successfulDeploy") + '</p>' +
            '<p>' + ctx._("deploy.unusedConfigNodes") + ' <a href="#" onclick="ctx.sidebar.config.show(true); return false;">' + ctx._("deploy.unusedConfigNodesLink") + '</a></p>', "success", false, 6000);
        } else {
          ctx.notify(ctx._("deploy.successfulDeploy"), "success");
        }
        ctx.nodes.eachNode(function (node) {
          if (node.changed) {
            node.dirty = true;
            node.changed = false;
          }
          if (node.moved) {
            node.dirty = true;
            node.moved = false;
          }
          if (node.credentials) {
            delete node.credentials;
          }
        });
        ctx.nodes.eachConfig(function (confNode) {
          confNode.changed = false;
          if (confNode.credentials) {
            delete confNode.credentials;
          }
        });
        ctx.nodes.eachWorkspace(function (ws) {
          ws.changed = false;
        })
        // Once deployed, cannot undo back to a clean state
        ctx.history.markAllDirty();
        ctx.view.redraw();
        ctx.events.emit("deploy");
      }).fail(function (xhr, textStatus, err) {
        ctx.nodes.dirty(true);
        $("#btn-deploy").removeClass("disabled");
        if (xhr.status === 401) {
          ctx.notify(ctx._("deploy.deployFailed", {
            message: ctx._("user.notAuthorized")
          }), "error");
        } else if (xhr.status === 409) {
          resolveConflict(nns, true);
        } else if (xhr.responseText) {
          ctx.notify(ctx._("deploy.deployFailed", {
            message: xhr.responseText
          }), "error");
        } else {
          ctx.notify(ctx._("deploy.deployFailed", {
            message: ctx._("deploy.errors.noResponse")
          }), "error");
        }
      }).always(function () {
        deployInflight = false;
        var delta = Math.max(0, 300 - (Date.now() - startTime));
        setTimeout(function () {
          $(".deploy-button-content").css('opacity', 1);
          $(".deploy-button-spinner").hide();
          $("#header-shade").hide();
          $("#editor-shade").hide();
          $("#palette-shade").hide();
          $("#sidebar-shade").hide();
        }, delta);
      });
    }
  }
}
